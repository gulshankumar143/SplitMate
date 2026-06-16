import { createSlice } from '@reduxjs/toolkit';

const initialState = { sidebarOpen: false, toast: null };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setToast: (state, action) => { state.toast = action.payload; },
    clearToast: (state) => { state.toast = null; }
  }
});

export const { toggleSidebar, setToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
