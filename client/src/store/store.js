import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import uiReducer from './slices/uiSlice.js';
import expenseReducer from './slices/expenseSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    expenses: expenseReducer
  }
});

export default store;
