/**
 * useAuth Hook
 * Hook para acceder al contexto de autenticación
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextDef';

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @returns {AuthContextValue}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}

export default useAuth;
