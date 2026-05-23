import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/product', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/product/singleProduct/${id}`);
    return data.product;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    featured: [],
    topRated: [],
    newArrivals: [],
    current: null,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.products || [];
        state.total = action.payload.totalProducts || 0;
        state.newArrivals = action.payload.newProducts || [];
        state.topRated = action.payload.topRatedProducts || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProduct.pending, (state) => { state.loading = true; state.current = null; })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearCurrent } = productSlice.actions;
export default productSlice.reducer;
