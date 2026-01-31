/**
 * Token Storage Utility
 * Gestión segura de tokens de autenticación
 * 
 * Nota: En producción, el refresh token debería estar en httpOnly cookie
 * manejada por el backend. Esta implementación es para desarrollo.
 */

import { AUTH_CONFIG } from '../config/constants';

// Almacenamiento en memoria para el access token (más seguro que localStorage)
let inMemoryAccessToken = null;

/**
 * Token Storage Manager
 */
export const tokenStorage = {
  /**
   * Guardar access token (en memoria)
   * @param {string} token - JWT access token
   */
  setAccessToken(token) {
    inMemoryAccessToken = token;
    // Backup en sessionStorage para persistir durante la sesión
    try {
      sessionStorage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.warn('SessionStorage not available:', error);
    }
  },

  /**
   * Obtener access token
   * @returns {string|null}
   */
  getAccessToken() {
    if (inMemoryAccessToken) {
      return inMemoryAccessToken;
    }
    // Intentar recuperar de sessionStorage si se recargó la página
    try {
      const token = sessionStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
      if (token) {
        inMemoryAccessToken = token;
        return token;
      }
    } catch (error) {
      console.warn('SessionStorage not available:', error);
    }
    return null;
  },

  /**
   * Guardar refresh token (en localStorage para persistencia)
   * Nota: En producción usar httpOnly cookie
   * @param {string} token - JWT refresh token
   */
  setRefreshToken(token) {
    try {
      localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.warn('LocalStorage not available:', error);
    }
  },

  /**
   * Obtener refresh token
   * @returns {string|null}
   */
  getRefreshToken() {
    try {
      return localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('LocalStorage not available:', error);
      return null;
    }
  },

  /**
   * Guardar ambos tokens
   * @param {string} accessToken 
   * @param {string} refreshToken 
   */
  setTokens(accessToken, refreshToken) {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  },

  /**
   * Limpiar todos los tokens
   */
  clearTokens() {
    inMemoryAccessToken = null;
    try {
      sessionStorage.removeItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('Storage not available:', error);
    }
  },

  /**
   * Verificar si hay tokens almacenados
   * @returns {boolean}
   */
  hasTokens() {
    return !!(this.getAccessToken() || this.getRefreshToken());
  },

  /**
   * Decodificar payload del JWT sin verificar firma
   * @param {string} token 
   * @returns {object|null}
   */
  decodeToken(token) {
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  /**
   * Verificar si el token ha expirado
   * @param {string} token 
   * @returns {boolean}
   */
  isTokenExpired(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    // Añadir buffer de 1 minuto
    const expirationTime = decoded.exp * 1000 - AUTH_CONFIG.TOKEN_EXPIRY_BUFFER;
    return Date.now() >= expirationTime;
  },

  /**
   * Obtener tiempo restante del token en ms
   * @param {string} token 
   * @returns {number}
   */
  getTokenTimeRemaining(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return 0;
    
    return Math.max(0, decoded.exp * 1000 - Date.now());
  },
};

export default tokenStorage;
