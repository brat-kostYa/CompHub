import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthToken } from '../../types/auth';
import type { RootState } from '../../store';

interface AuthState {
  user: Omit<AuthToken, 'accessToken'> | null;
  token: string | null;
}

const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
  token: storedToken,
  user: storedUser ? (JSON.parse(storedUser) as Omit<AuthToken, 'accessToken'>) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthToken>) {
      const { accessToken, ...user } = action.payload;
      state.token = accessToken;
      state.user = user;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState): AuthState['user'] => state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean => !!state.auth.token;