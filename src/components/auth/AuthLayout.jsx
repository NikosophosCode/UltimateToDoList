/**
 * AuthLayout Component
 * Layout compartido para páginas de autenticación
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/constants';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido del layout
 * @param {string} [props.title] - Título de la página
 * @param {string} [props.subtitle] - Subtítulo de la página
 */
function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link 
          to={ROUTES.HOME}
          className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
        >
          <svg 
            className="w-8 h-8 text-accent" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
            />
          </svg>
          <span className="font-bold text-xl">UltimateToDo</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-card border border-theme rounded-2xl shadow-lg p-6 sm:p-8">
            {/* Title */}
            {title && (
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-primary mb-2">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-secondary text-sm">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Content */}
            {children}
          </div>

          {/* Footer */}
          <p className="text-center text-secondary text-xs mt-6">
            © {new Date().getFullYear()} UltimateToDo. Todos los derechos reservados.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
