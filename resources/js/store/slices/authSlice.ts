import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'oidc-client-ts';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.token = action.payload?.access_token || null;
            state.isAuthenticated = !!action.payload;
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
