/**
 * ForgotPasswordForm Component
 * Formulario para solicitar recuperación de contraseña
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { forgotPasswordSchema } from '../../utils/validators';
import { logError } from '../../utils/errorHandler';
import { ButtonSpinner } from '../common/LoadingSpinner';
import { ROUTES, SUCCESS_MESSAGES } from '../../config/constants';
import { cn } from '../../lib/utils';

function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    setError(null);
    
    try {
      await authApi.forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (err) {
      // Por seguridad, no revelamos si el email existe
      // Mostramos mensaje de éxito de todos modos
      setIsSubmitted(true);
      logError(err, 'ForgotPasswordForm.onSubmit');
    }
  };

  // Vista de éxito
  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-primary">
          ¡Revisa tu correo!
        </h3>
        <p className="text-secondary">
          Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.
        </p>
        <p className="text-sm text-secondary">
          No olvides revisar tu carpeta de spam.
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="inline-block mt-4 text-accent hover:underline font-medium"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Descripción */}
      <p className="text-secondary text-sm text-center">
        Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-primary">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
            className={cn(
              'w-full pl-10 pr-4 py-3 rounded-xl bg-hover border border-theme',
              'text-primary placeholder-secondary',
              'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200',
              errors.email && 'border-red-500 focus:ring-red-500'
            )}
            placeholder="tu@email.com"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full py-3 px-4 rounded-xl font-semibold text-white',
          'bg-accent hover:opacity-90',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200',
          'flex items-center justify-center gap-2'
        )}
      >
        {isSubmitting ? (
          <>
            <ButtonSpinner />
            <span>Enviando...</span>
          </>
        ) : (
          'Enviar enlace de recuperación'
        )}
      </button>

      {/* Back to Login */}
      <div className="text-center">
        <Link
          to={ROUTES.LOGIN}
          className="text-sm text-accent hover:underline transition-colors inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio de sesión
        </Link>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
