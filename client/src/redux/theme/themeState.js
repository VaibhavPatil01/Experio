import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return localStorage.getItem('theme') || 'light';
};

const initialState = {
  theme: getInitialTheme()
};

export const ThemeSlice = createSlice({
  name: 'themeState',
  initialState,

  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    setTheme: (state, action) => {
      state.theme = action.payload;
    }
  }
});

export default ThemeSlice.reducer;
export const themeAction = ThemeSlice.actions;
