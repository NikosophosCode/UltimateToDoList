import React from 'react';

/**
 * useLocalStorage Hook
 * Hook personalizado para manejar la persistencia de datos en localStorage
 * 
 * @param {string} key - La clave para almacenar en localStorage
 * @param {*} initialValue - Valor inicial si no existe en localStorage
 * @returns {Array} [storedValue, setValue] - Estado y función para actualizarlo
 */
function useLocalStorage(key, initialValue) {
  // Estado para almacenar nuestro valor
  // Pasamos una función de inicialización a useState para que la lógica solo se ejecute una vez
  const [storedValue, setStoredValue] = React.useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Obtener del localStorage por clave
      const item = window.localStorage.getItem(key);
      // Parsear el JSON almacenado o si no existe retornar initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error también retornar initialValue
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Retornar una versión envuelta de la función setter de useState que ...
  // ... persiste el nuevo valor en localStorage
  const setValue = (value) => {
    try {
      // Permitir que value sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Si hay error, al menos actualizar el estado
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
