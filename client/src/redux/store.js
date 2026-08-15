import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { UserSlice } from './user/userState.js';
import { ThemeSlice } from './theme/themeState.js';

export const store = configureStore({
  reducer: {
    userState: UserSlice.reducer,
    themeState: ThemeSlice.reducer
  }
});

export const useAppDispatch = () => useDispatch();

export const useAppSelector = useSelector;
