/**
 * AuthProvider
 * Proveedor del contexto de autenticación
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContextDef';
import { authApi } from '../api/authApi';
import { tokenStorage } from '../utils/tokenStorage';
import { getErrorMessage, logError } from '../utils/errorHandler';
import { ROUTES, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../config/constants';

/**
 * AuthProvider Component
 * Proveedor del contexto de autenticación
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Inicializar autenticación al cargar la app
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const hasTokens = tokenStorage.hasTokens();
        
        if (!hasTokens) {
          setIsLoading(false);
          return;
        }

        const accessToken = tokenStorage.getAccessToken();
        
        // Si el access token está expirado, intentar refresh
        if (accessToken && tokenStorage.isTokenExpired(accessToken)) {
          const refreshToken = tokenStorage.getRefreshToken();
          
          if (refreshToken && !tokenStorage.isTokenExpired(refreshToken)) {
            try {
              const tokens = await authApi.refreshToken(refreshToken);
              tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken || refreshToken);
            } catch {
              // Si falla el refresh, limpiar tokens
              tokenStorage.clearTokens();
              setIsLoading(false);
              return;
            }
          } else {
            tokenStorage.clearTokens();
            setIsLoading(false);
            return;
          }
        }

        // Obtener datos del usuario actual
        const userData = await authApi.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        
      } catch (error) {
        logError(error, 'AuthContext.initAuth');
        tokenStorage.clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Escuchar evento de sesión expirada
   */
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setIsAuthenticated(false);
      setError(ERROR_MESSAGES.SESSION_EXPIRED);
      navigate(ROUTES.LOGIN, { 
        state: { from: location.pathname },
        replace: true 
      });
    };

    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
    };
  }, [navigate, location.pathname]);

  /**
   * Login con email y contraseña
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(credentials);
      const { user: userData, accessToken, refreshToken } = response;
      
      tokenStorage.setTokens(accessToken, refreshToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Redirigir a la página anterior o home
      const from = location.state?.from || ROUTES.HOME;
      navigate(from, { replace: true });
      
      return { success: true, user: userData, message: SUCCESS_MESSAGES.LOGIN };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      logError(error, 'AuthContext.login');
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location.state]);

  /**
   * Registro de nuevo usuario
   */
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.register(userData);
      const { user: newUser, accessToken, refreshToken } = response;
      
      tokenStorage.setTokens(accessToken, refreshToken);
      setUser(newUser);
      setIsAuthenticated(true);
      
      navigate(ROUTES.HOME, { replace: true });
      
      return { success: true, user: newUser, message: SUCCESS_MESSAGES.REGISTER };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      logError(error, 'AuthContext.register');
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  /**
   * Login con Google OAuth
   */
  const loginWithGoogle = useCallback(async (credential) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.googleLogin(credential);
      const { user: userData, accessToken, refreshToken } = response;
      
      tokenStorage.setTokens(accessToken, refreshToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      const from = location.state?.from || ROUTES.HOME;
      navigate(from, { replace: true });
      
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      logError(error, 'AuthContext.loginWithGoogle');
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location.state]);

  /**
   * Login con Facebook OAuth
   */
  const loginWithFacebook = useCallback(async (accessToken, userId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.facebookLogin(accessToken, userId);
      const { user: userData, accessToken: token, refreshToken } = response;
      
      tokenStorage.setTokens(token, refreshToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      const from = location.state?.from || ROUTES.HOME;
      navigate(from, { replace: true });
      
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      logError(error, 'AuthContext.loginWithFacebook');
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location.state]);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      await authApi.logout(refreshToken);
    } catch (error) {
      // Ignorar errores de logout
      logError(error, 'AuthContext.logout');
    } finally {
      tokenStorage.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [navigate]);

  /**
   * Actualizar datos del usuario localmente
   */
  const updateUser = useCallback((updatedData) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, ...updatedData };
    });
  }, []);

  /**
   * Refrescar datos del usuario desde el servidor
   */
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      logError(error, 'AuthContext.refreshUser');
      return null;
    }
  }, [isAuthenticated]);

  /**
   * Valor del contexto memorizado
   */
  const value = useMemo(() => ({
    // Estado
    user,
    isLoading,
    isAuthenticated,
    error,
    
    // Acciones
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    updateUser,
    refreshUser,
    clearError,
  }), [
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    updateUser,
    refreshUser,
    clearError,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
