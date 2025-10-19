
import { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // useState: Manage theme state (light or dark)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // useEffect: Apply theme to document and persist in localStorage
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // useCallback: Memoize toggleTheme function
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const value = { theme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};