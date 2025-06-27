import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Vite

// Async Thunk para obtener categorías
export const fetchListings = createAsyncThunk(
  'listings/fetchListings',
  async (searchQuery, { fulfillWithValue, rejectWithValue }) => {
    try {
      // Verificar si hay filtros activos (excepto paginación)
      const hasFilters = Object.entries(searchQuery).some(
        ([key, value]) => 
          key !== 'page' && 
          value !== undefined && 
          value !== '' && 
          value !== null &&
          !(key === 'type' && value === 'all') &&
          !(key === 'parking' && value === false) &&
          !(key === 'furnished' && value === false) &&
          !(key === 'offer' && value === false) &&
          !(key === 'minPrice' && value === 0) &&
          !(key === 'maxPrice' && value === 10000) &&
          !(key === 'sort' && value === 'createdAt_desc')
      );

      let url = `${API_BASE_URL}/listing/get`;
      
      if (hasFilters) {
        const queryString = new URLSearchParams();
        
        // Agregar solo parámetros con valores significativos
        for (const key in searchQuery) {
          if (
            searchQuery[key] !== undefined && 
            searchQuery[key] !== '' && 
            searchQuery[key] !== null &&
            !(key === 'type' && searchQuery[key] === 'all') &&
            !(key === 'parking' && searchQuery[key] === false) &&
            !(key === 'furnished' && searchQuery[key] === false) &&
            !(key === 'offer' && searchQuery[key] === false)
          ) {
            queryString.append(key, searchQuery[key]);
          }
        }
        
        url += `?${queryString}`;
      }

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const data = await response.json();
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error fetching listings:', error.message);
      return rejectWithValue(error.message || 'Error al obtener los listados');
    }
  }
);
const listingSlice = createSlice({
  name: 'listing',
  initialState: {
    listings: [],
    totalListings: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload.listings || []; // Asegurar array vacío si no hay resultados
        state.totalListings = action.payload.total || 0; // Asegurar 0 si no hay total
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar los listados';
        state.listings = []; // Limpiar resultados en caso de error
        state.totalListings = 0;
      });
  }
});

export default listingSlice.reducer;