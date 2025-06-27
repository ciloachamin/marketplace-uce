import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Vite

// Async Thunk para obtener categorías
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const apiUrl = `${API_BASE_URL}/category/get`;
      console.log('Fetching categories from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log("Response status:", response);
      
      if (!response.ok) {
        const errorData = await response.text(); // Intenta leer el cuerpo como texto primero
        throw new Error(`Error ${response.status}: ${errorData || response.statusText}`);
      }

      // Verifica el content-type antes de parsear
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${contentType}. Response: ${text}`);
      }

      const data = await response.json();
      console.log("Received data:", data);
      
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      return rejectWithValue(error.message || 'Error al obtener categorías');
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;