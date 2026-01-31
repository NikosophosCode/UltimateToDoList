/**
 * PublicRoute Component
 * Componente para rutas públicas (login, register)
 * Redirige a home si el usuario ya está autenticado
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { ROUTES } from '../../config/constants';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si NO está autenticado
 * @param {string} [props.redirectTo] - Ruta a la que redirigir si está autenticado
 */
function PublicRoute({ children, redirectTo = ROUTES.HOME }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Cargando..." />;
  }

  // Si está autenticado, redirigir al destino original o home
  if (isAuthenticated) {
    const from = location.state?.from || redirectTo;
    return <Navigate to={from} replace />;
  }

  // Si no está autenticado, renderizar el contenido
  return children;
}

export default PublicRoute;
