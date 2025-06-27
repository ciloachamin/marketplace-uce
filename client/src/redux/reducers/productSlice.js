import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (searchQuery = {}, { fulfillWithValue, rejectWithValue }) => {
    try {
      // Verificar si hay filtros activos (excepto paginación y valores por defecto)
      const hasFilters = Object.entries(searchQuery).some(
        ([key, value]) => 
          key !== 'page' && 
          value !== undefined && 
          value !== '' && 
          value !== null &&
          !(key === 'category' && value === 'all') &&
          !(key === 'brand' && value === 'all') &&
          !(key === 'campus' && value === 'all') &&
          !(key === 'discount' && value === false) &&
          !(key === 'approvedForSale' && value === false) &&
          !(key === 'minPrice' && value === 0) &&
          !(key === 'maxPrice' && value === 10000) &&
          !(key === 'minRating' && value === 0) &&
          !(key === 'sort' && value === 'createdAt_desc')
      );

      let url = `${API_BASE_URL}/product/filter`;
      
      if (hasFilters) {
        const queryString = new URLSearchParams();
        
        // Agregar solo parámetros con valores significativos
        for (const key in searchQuery) {
          if (
            searchQuery[key] !== undefined && 
            searchQuery[key] !== '' && 
            searchQuery[key] !== null &&
            !(key === 'category' && searchQuery[key] === 'all') &&
            !(key === 'brand' && searchQuery[key] === 'all') &&
            !(key === 'campus' && searchQuery[key] === 'all') &&
            !(key === 'discount' && searchQuery[key] === false) &&
            !(key === 'approvedForSale' && searchQuery[key] === false) &&
            !(key === 'minRating' && searchQuery[key] === 0)
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

      console.log(response);
      
      const data = await response.json();
      console.log(data);
      
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      return rejectWithValue(error.message || 'Error al obtener los productos');
    }
  }
);


const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    totalProducts: 0,
    loading: false,
    error: null,
    searchResults: [],
    searchLoading: false,
    searchError: null
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
    resetProductFilters: (state) => {
      state.products = [];
      state.totalProducts = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.total || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
        state.totalProducts = 0;
      })
  }
});

export const { clearSearchResults, resetProductFilters } = productSlice.actions;
export default productSlice.reducer;