/**
 * Axios Configuration
 * Cliente HTTP configurado con interceptores para autenticación
 */

import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { tokenStorage } from '../utils/tokenStorage';
import { parseApiError, logError } from '../utils/errorHandler';

/**
 * Crear instancia de Axios con configuración base
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Permitir cookies httpOnly
});

/**
 * Flag para evitar múltiples refreshes simultáneos
 */
let isRefreshing = false;
let failedQueue = [];

/**
 * Procesar cola de requests fallidos después del refresh
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Interceptor de Request
 * Agrega el token de autenticación a cada request
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    logError(error, 'Request Interceptor');
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response
 * Maneja refresh de tokens y errores globales
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error no es 401 o ya se intentó refresh, rechazar
    if (error.response?.status !== 401 || originalRequest._retry) {
      logError(error, 'Response Interceptor');
      return Promise.reject(parseApiError(error));
    }
    
    // Verificar si el código indica token expirado
    const errorCode = error.response?.data?.code;
    if (errorCode !== 'TOKEN_EXPIRED' && errorCode !== 'INVALID_TOKEN') {
      return Promise.reject(parseApiError(error));
    }
    
    // Si ya está refreshing, agregar a la cola
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      // Hacer request de refresh (sin usar el interceptor)
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Guardar nuevos tokens
      tokenStorage.setAccessToken(accessToken);
      if (newRefreshToken) {
        tokenStorage.setRefreshToken(newRefreshToken);
      }
      
      // Procesar cola de requests pendientes
      processQueue(null, accessToken);
      
      // Reintentar request original
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
      
    } catch (refreshError) {
      // Limpiar tokens y redirigir a login
      processQueue(refreshError, null);
      tokenStorage.clearTokens();
      
      // Disparar evento para que AuthContext maneje el logout
      window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
      
      return Promise.reject(parseApiError(refreshError));
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * Métodos helper para requests comunes
 */
export const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  
  /**
   * Upload de archivos con FormData
   */
  upload: (url, formData, onProgress) => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress
        ? (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        : undefined,
    });
  },
};

export default apiClient;
