import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'dark',
    navScrolled: false,
  },
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setNavScrolled(state, action) {
      state.navScrolled = action.payload;
    },
  },
});

export const { setTheme, setNavScrolled } = uiSlice.actions;
export default uiSlice.reducer;
