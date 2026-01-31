/**
 * LoadingSpinner Component
 * Componente de loading reutilizable
 */

import React from 'react';
import { cn } from '../../lib/utils';

/**
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md'] - Tamaño del spinner
 * @param {boolean} [props.fullScreen=false] - Si debe ocupar toda la pantalla
 * @param {string} [props.message] - Mensaje opcional a mostrar
 * @param {string} [props.className] - Clases adicionales
 */
function LoadingSpinner({ 
  size = 'md', 
  fullScreen = false, 
  message,
  className 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-solid border-accent border-t-transparent',
          sizeClasses[size]
        )}
        role="status"
        aria-label="Cargando"
      />
      {message && (
        <p className="text-secondary text-sm animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * Variante con overlay
 */
export function LoadingOverlay({ message, isVisible = true }) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
}

/**
 * Variante inline pequeña (para botones)
 */
export function ButtonSpinner({ className }) {
  return (
    <div
      className={cn(
        'w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin',
        className
      )}
      role="status"
      aria-label="Cargando"
    />
  );
}

export default LoadingSpinner;
