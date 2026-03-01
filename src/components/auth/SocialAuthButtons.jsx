/**
 * SocialAuthButtons Component
 * Botones de autenticación con OAuth (Google, Facebook)
 * Integra Google Identity Services y Facebook Login SDK
 */

import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import { ButtonSpinner } from '../common/LoadingSpinner';
import { cn } from '../../lib/utils';
import { OAUTH_CONFIG } from '../../config/constants';
import { loadFacebookSDK, facebookLogin } from '../../config/facebookSDK';
import { toast } from 'sonner';

/**
 * @param {Object} props
 * @param {string} [props.mode='login'] - 'login' | 'register'
 * @param {Function} [props.onSuccess] - Callback al autenticarse exitosamente
 */
function SocialAuthButtons({ mode = 'login', onSuccess }) {
  const { loginWithGoogle, loginWithFacebook, clearError } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [fbReady, setFbReady] = useState(false);

  const showGoogle = OAUTH_CONFIG.ENABLE_GOOGLE_AUTH && !!OAUTH_CONFIG.GOOGLE_CLIENT_ID;
  const showFacebook = OAUTH_CONFIG.ENABLE_FACEBOOK_AUTH && !!OAUTH_CONFIG.FACEBOOK_APP_ID;

  // Precargar Facebook SDK si está habilitado
  useEffect(() => {
    if (showFacebook) {
      loadFacebookSDK()
        .then(() => setFbReady(true))
        .catch((err) => console.warn('Facebook SDK no disponible:', err.message));
    }
  }, [showFacebook]);

  // Google Login via Authorization Code / Implicit flow
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // tokenResponse.access_token es el token de Google
      setLoadingProvider('google');
      clearError();
      try {
        const result = await loginWithGoogle(tokenResponse.access_token);
        if (result.success && onSuccess) {
          onSuccess(result.user);
        } else if (!result.success) {
          toast.error(result.error || 'Error al iniciar sesión con Google');
        }
      } catch (err) {
        toast.error('Error al iniciar sesión con Google');
      } finally {
        setLoadingProvider(null);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      setLoadingProvider(null);
      if (error?.type !== 'popup_closed') {
        toast.error('Error al conectar con Google');
      }
    },
    onNonOAuthError: () => {
      // Usuario cerró el popup
      setLoadingProvider(null);
    },
    flow: 'implicit',
  });

  const handleGoogleAuth = () => {
    setLoadingProvider('google');
    clearError();
    googleLogin();
  };

  const handleFacebookAuth = async () => {
    if (!fbReady) {
      toast.error('Facebook SDK aún no está listo. Intenta de nuevo.');
      return;
    }

    setLoadingProvider('facebook');
    clearError();

    try {
      const { accessToken, userID } = await facebookLogin();
      const result = await loginWithFacebook(accessToken, userID);
      if (result.success && onSuccess) {
        onSuccess(result.user);
      } else if (!result.success) {
        toast.error(result.error || 'Error al iniciar sesión con Facebook');
      }
    } catch (err) {
      if (err.message?.includes('cancelado')) {
        // El usuario cerró el popup, no mostrar error
      } else {
        toast.error('Error al conectar con Facebook');
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  const isLoading = loadingProvider !== null;
  const actionText = mode === 'login' ? 'Iniciar sesión' : 'Registrarse';

  // Si ningún proveedor está habilitado, no mostrar nada
  if (!showGoogle && !showFacebook) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Google Button */}
      {showGoogle && (
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className={cn(
            'w-full py-3 px-4 rounded-xl font-medium',
            'bg-white hover:bg-gray-50 text-gray-700',
            'border border-gray-300',
            'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-background',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            'flex items-center justify-center gap-3'
          )}
        >
          {loadingProvider === 'google' ? (
            <ButtonSpinner className="text-gray-700" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span>{actionText} con Google</span>
        </button>
      )}

      {/* Facebook Button */}
      {showFacebook && (
        <button
          type="button"
          onClick={handleFacebookAuth}
          disabled={isLoading || !fbReady}
          className={cn(
            'w-full py-3 px-4 rounded-xl font-medium',
            'bg-[#1877F2] hover:bg-[#166FE5] text-white',
            'focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 focus:ring-offset-background',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            'flex items-center justify-center gap-3'
          )}
        >
          {loadingProvider === 'facebook' ? (
            <ButtonSpinner />
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span>{actionText} con Facebook</span>
        </button>
      )}

      {/* Divider - solo mostrar si hay al menos un proveedor */}
      {(showGoogle || showFacebook) && (
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-theme"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-secondary">
              o continúa con email
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SocialAuthButtons;
