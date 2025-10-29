import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  navCollapsed: false,
  showSidebar: false,
  snackbar: {
    open: false,
    message: '',
    severity: 'success',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleNavCollapsed: (state) => {
      state.navCollapsed = !state.navCollapsed;
    },
    setShowSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    showSnackbar: (state, action) => {
      state.snackbar = { ...action.payload, open: true };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
  },
});

export const { 
  toggleNavCollapsed, 
  setShowSidebar, 
  showSnackbar, 
  hideSnackbar 
} = uiSlice.actions;

export default uiSlice.reducer;