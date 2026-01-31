/**
 * LoginPage
 * Página de inicio de sesión
 */

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import SocialAuthButtons from '../../components/auth/SocialAuthButtons';

function LoginPage() {
  const location = useLocation();
  const message = location.state?.message;

  // Limpiar el state del location después de mostrar el mensaje
  useEffect(() => {
    if (message) {
      window.history.replaceState({}, document.title);
    }
  }, [message]);

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para acceder a tus tareas"
    >
      {/* Mensaje de éxito (ej: después de cambiar contraseña) */}
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{message}</span>
        </div>
      )}

      {/* Social Auth */}
      <SocialAuthButtons mode="login" />

      {/* Login Form */}
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
