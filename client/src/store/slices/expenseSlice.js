import { createSlice } from '@reduxjs/toolkit';

const initialState = { list: [], selectedExpense: null, analytics: { categories: [], monthly: [] }, loading: false, error: null };

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action) => { state.list = action.payload; state.loading = false; state.error = null; },
    setSelectedExpense: (state, action) => { state.selectedExpense = action.payload; },
    setAnalytics: (state, action) => { state.analytics = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; }
  }
});

export const { setExpenses, setSelectedExpense, setAnalytics, setLoading, setError } = expenseSlice.actions;
export default expenseSlice.reducer;
