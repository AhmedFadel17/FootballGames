import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';
import storage from 'redux-persist/lib/storage'; // for clearing persist

interface JwtPayload {
  id: number;
  role: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: JwtPayload | null;
  expiresAt: number | null;
  rememberMe: boolean;
}

const initialState: AuthState = {
  isAuthenticated: !!Cookies.get('token'),
  token: Cookies.get('token') || null,
  refreshToken: Cookies.get('refresh_token') || null,
  user: null,
  rememberMe: false,
  expiresAt: null,
};

/**
 * 🔹 Auto guest login if no token exists
 */
export const guestLogin = createAsyncThunk('auth/guestLogin', async () => {
  const response = await axios.post('/api/auth/guest-login');
  return response.data;
});

/**
 * 🔹 Try refreshing token if expired
 */
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    const refreshToken = state.auth.refreshToken || Cookies.get('refresh_token');

    if (!refreshToken) throw new Error('No refresh token available');

    const response = await axios.post('/api/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<any>) => {
      const token = action.payload.access_token;
      const refreshToken = action.payload.refresh_token;
      const expiresIn = action.payload.expires_in;
      const rememberMe = action.payload.rememberMe !== 'undefined' ? action.payload.rememberMe : state.rememberMe;

      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.expiresAt = Date.now() + expiresIn * 1000;
      state.rememberMe = rememberMe;
      state.user = action.payload.user;

      // ✅ Store in cookies
      Cookies.set('token', token, { expires: rememberMe ? 7 : undefined });
      Cookies.set('refresh_token', refreshToken, { expires: rememberMe ? 7 : undefined });


    },

    logout: (state) => {
      Cookies.remove('token');
      Cookies.remove('refresh_token');

      // ✅ Clear persisted redux store
      storage.removeItem('persist:root');

      return { ...initialState, isAuthenticated: false };
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Guest Login
      .addCase(guestLogin.fulfilled, (state, action) => {
        authSlice.caseReducers.loginSuccess(state, {
          payload: action.payload,
          type: 'auth/loginSuccess',
        });
      })

      // ✅ Refresh Access Token
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        authSlice.caseReducers.loginSuccess(state, {
          payload: { ...action.payload, rememberMe: state.rememberMe },
          type: 'auth/loginSuccess',
        });
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
