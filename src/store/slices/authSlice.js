import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/profile');
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', formData);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.get('/auth/logout');
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setUser: (state, action) => { state.user = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(fetchProfile.rejected, (state) => { state.user = null; state.loading = false; })
      .addCase(loginUser.fulfilled, (state, action) => { state.user = action.payload; state.error = null; })
      .addCase(loginUser.rejected, (state, action) => { state.error = action.payload; })
      .addCase(registerUser.fulfilled, (state, action) => { 
        // Don't set user state - registration should not auto-login
        state.error = null; 
      })
      .addCase(registerUser.rejected, (state, action) => { state.error = action.payload; })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; });
  },
});

export const { clearError, setUser } = authSlice.actions;
export const updateUser = setUser; // Alias for profile updates
export default authSlice.reducer;
