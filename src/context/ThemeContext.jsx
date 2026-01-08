import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * ThemeContext
 * Contexto global para gestionar temas y colores de acento
 */
const ThemeContext = createContext();

// Colores de acento disponibles
export const accentColors = [
  { id: 'purple', name: 'Purple', from: '#8b5cf6', to: '#ec4899', class: 'from-purple-500 to-pink-500' },
  { id: 'blue', name: 'Blue', from: '#3b82f6', to: '#06b6d4', class: 'from-blue-500 to-cyan-500' },
  { id: 'green', name: 'Green', from: '#10b981', to: '#14b8a6', class: 'from-green-500 to-teal-500' },
  { id: 'orange', name: 'Orange', from: '#f59e0b', to: '#ef4444', class: 'from-amber-500 to-red-500' },
  { id: 'rose', name: 'Rose', from: '#f43f5e', to: '#ec4899', class: 'from-rose-500 to-pink-500' },
  { id: 'indigo', name: 'Indigo', from: '#6366f1', to: '#8b5cf6', class: 'from-indigo-500 to-purple-500' },
];

/**
 * ThemeProvider Component
 * Proveedor del contexto de tema
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  const [accentColor, setAccentColor] = useState(() => {
    const saved = localStorage.getItem('accentColor');
    return saved || 'purple';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    document.documentElement.setAttribute('data-accent', accentColor);
    
    // Aplicar colores CSS personalizados
    const color = accentColors.find(c => c.id === accentColor);
    if (color) {
      document.documentElement.style.setProperty('--accent-from', color.from);
      document.documentElement.style.setProperty('--accent-to', color.to);
    }
  }, [accentColor]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const changeAccentColor = (colorId) => {
    setAccentColor(colorId);
  };

  const value = {
    theme,
    accentColor,
    toggleTheme,
    changeAccentColor,
    setTheme,
    accentColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * Hook personalizado para acceder al contexto de tema
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
