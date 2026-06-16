import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('accessToken') || null,
  loading: false,
  error: null,
  initializing: true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.error = null;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setInitializing: (state, action) => {
      state.initializing = action.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.initializing = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('otpEmail');
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; }
  }
});

export const { setCredentials, setUser, setInitializing, logOut, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
