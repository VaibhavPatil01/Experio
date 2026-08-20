import { useEffect } from 'react';
import { useAppSelector } from '../redux/store';
import { applyThemeColor } from '../utils/theme';

const useThemeInit = () => {
  const theme = useAppSelector((state) => state.themeState.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load primary theme color on mount
  useEffect(() => {
    const savedColor = localStorage.getItem('primaryColor') || 'darkblue';
    applyThemeColor(savedColor);
  }, []);
};

export default useThemeInit;
