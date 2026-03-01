/**
 * LinkedAccounts Component
 * Gestión de cuentas OAuth vinculadas (Google, Facebook)
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/userApi';
import { ButtonSpinner } from '../common/LoadingSpinner';
import { toast } from 'sonner';

function LinkedAccounts() {
  const { user, refreshUser } = useAuth();
  const [linkedAccounts, setLinkedAccounts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  const fetchLinkedAccounts = async () => {
    try {
      const data = await userApi.getLinkedAccounts();
      setLinkedAccounts(data);
    } catch (err) {
      // Fallback: inferir de los datos del usuario
      setLinkedAccounts({
        google: !!(user?.google_id || user?.googleId),
        facebook: !!(user?.facebook_id || user?.facebookId),
        hasPassword: user?.has_password ?? user?.hasPassword ?? true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlink = async (provider) => {
    // Validar que el usuario tenga otro método de autenticación
    const otherProvider = provider === 'google' ? 'facebook' : 'google';
    const hasOther = linkedAccounts?.[otherProvider];
    const hasPassword = linkedAccounts?.hasPassword;

    if (!hasOther && !hasPassword) {
      toast.error('Debes tener al menos un método de inicio de sesión');
      return;
    }

    setActionLoading(provider);
    try {
      await userApi.unlinkOAuthAccount(provider);
      setLinkedAccounts(prev => ({ ...prev, [provider]: false }));
      await refreshUser();
      toast.success(`Cuenta de ${provider === 'google' ? 'Google' : 'Facebook'} desvinculada`);
    } catch (err) {
      toast.error(err.message || 'Error al desvincular la cuenta');
    } finally {
      setActionLoading(null);
    }
  };

  const providers = [
    {
      id: 'google',
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      ),
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      bgColor: 'bg-[#1877F2]',
      textColor: 'text-white',
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
        <div className="flex items-center justify-center py-4">
          <ButtonSpinner className="text-secondary" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
      <h2 className="text-primary font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Cuentas Vinculadas
      </h2>

      <div className="space-y-3">
        {providers.map((provider) => {
          const isLinked = linkedAccounts?.[provider.id];
          const isActionLoading = actionLoading === provider.id;

          return (
            <div
              key={provider.id}
              className="flex items-center justify-between p-3 rounded-lg bg-hover border border-theme"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${provider.bgColor} flex items-center justify-center`}>
                  {provider.icon}
                </div>
                <div>
                  <span className="text-primary text-sm font-medium">{provider.name}</span>
                  <p className="text-xs text-secondary">
                    {isLinked ? 'Conectado' : 'No conectado'}
                  </p>
                </div>
              </div>

              {isLinked ? (
                <button
                  onClick={() => handleUnlink(provider.id)}
                  disabled={isActionLoading}
                  className="text-xs text-red-500 hover:text-red-400 font-medium px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  {isActionLoading ? (
                    <ButtonSpinner className="text-red-500" />
                  ) : (
                    'Desvincular'
                  )}
                </button>
              ) : (
                <span className="text-xs text-tertiary px-3 py-1.5">
                  —
                </span>
              )}
            </div>
          );
        })}
      </div>

      {linkedAccounts?.hasPassword === false && (
        <p className="text-xs text-yellow-500 mt-3 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Establece una contraseña antes de desvincular proveedores
        </p>
      )}
    </div>
  );
}

export default LinkedAccounts;
