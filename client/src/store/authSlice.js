import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client';

const tokenKey = 'sd_fitness_auth_token';
const roleKey = 'sd_fitness_auth_role';
const legacyAdminTokenKey = 'sd_fitness_admin_token';

const initialToken =
  typeof window !== 'undefined'
    ? localStorage.getItem(tokenKey) || localStorage.getItem(legacyAdminTokenKey)
    : null;

const initialRole = typeof window !== 'undefined' ? localStorage.getItem(roleKey) : null;
const inferredInitialRole =
  initialRole ||
  (typeof window !== 'undefined' && localStorage.getItem(legacyAdminTokenKey) ? 'admin' : null);

export const loginAdmin = createAsyncThunk('auth/loginAdmin', async (credentials, thunkAPI) => {
  try {
    const { data } = await api.post('/api/auth/admin/login', credentials);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const loginTrainer = createAsyncThunk('auth/loginTrainer', async (credentials, thunkAPI) => {
  try {
    const { data } = await api.post('/api/auth/trainer/login', credentials);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/api/auth/user/register', payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/api/auth/user/login', payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerTrainer = createAsyncThunk('auth/registerTrainer', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/api/auth/trainer/register', payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: null,
    trainer: null,
     user: null,
    role: inferredInitialRole,
    token: initialToken,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.admin = null;
      state.trainer = null;
       state.user = null;
      state.role = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(roleKey);
        localStorage.removeItem(legacyAdminTokenKey);
      }
    },
    setCredentials(state, action) {
      state.admin = action.payload.admin;
      state.trainer = action.payload.trainer || null;
      state.user = action.payload.user || null;
      state.role =
        action.payload.role ||
        (action.payload.admin
          ? 'admin'
          : action.payload.trainer
          ? 'trainer'
          : action.payload.user
          ? 'user'
          : null);
      state.token = action.payload.token;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.admin = action.payload.admin;
        state.trainer = null;
        state.user = null;
        state.role = 'admin';
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem(tokenKey, action.payload.token);
          localStorage.setItem(roleKey, 'admin');
          localStorage.setItem(legacyAdminTokenKey, action.payload.token);
        }
      })
      .addCase(loginTrainer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginTrainer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainer = action.payload.trainer;
        state.admin = null;
        state.user = null;
        state.role = 'trainer';
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem(tokenKey, action.payload.token);
          localStorage.setItem(roleKey, 'trainer');
        }
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      .addCase(loginTrainer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.admin = null;
        state.trainer = null;
        state.role = 'user';
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem(tokenKey, action.payload.token);
          localStorage.setItem(roleKey, 'user');
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.admin = null;
        state.trainer = null;
        state.role = 'user';
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem(tokenKey, action.payload.token);
          localStorage.setItem(roleKey, 'user');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      .addCase(registerTrainer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerTrainer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainer = action.payload.trainer;
        state.admin = null;
        state.user = null;
        state.role = 'trainer';
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem(tokenKey, action.payload.token);
          localStorage.setItem(roleKey, 'trainer');
        }
      })
      .addCase(registerTrainer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
