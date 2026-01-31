/**
 * ProtectedRoute Component
 * Componente para proteger rutas que requieren autenticación
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { ROUTES } from '../../config/constants';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si está autenticado
 * @param {string} [props.redirectTo] - Ruta a la que redirigir si no está autenticado
 */
function ProtectedRoute({ children, redirectTo = ROUTES.LOGIN }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Verificando sesión..." />;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Si está autenticado, renderizar el contenido
  return children;
}

export default ProtectedRoute;
