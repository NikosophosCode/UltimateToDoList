/**
 * Error Handler Utility
 * Manejo centralizado de errores de la aplicación
 */

import { ERROR_MESSAGES } from '../config/constants';

/**
 * Clase para errores de la API
 */
export class ApiError extends Error {
  constructor(message, status, code, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Clase para errores de autenticación
 */
export class AuthError extends Error {
  constructor(message, code = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

/**
 * Parsear error de respuesta de Axios
 * @param {Error} error - Error de Axios
 * @returns {ApiError}
 */
export const parseApiError = (error) => {
  // Error de red (sin conexión)
  if (!error.response) {
    return new ApiError(
      ERROR_MESSAGES.NETWORK_ERROR,
      0,
      'NETWORK_ERROR'
    );
  }

  const { status, data } = error.response;

  // Mapear códigos de estado a mensajes
  const statusMessages = {
    400: data?.message || 'Solicitud inválida',
    401: data?.message || ERROR_MESSAGES.INVALID_CREDENTIALS,
    403: 'No tienes permiso para realizar esta acción',
    404: 'Recurso no encontrado',
    409: data?.message || ERROR_MESSAGES.EMAIL_EXISTS,
    422: data?.message || 'Datos de entrada inválidos',
    429: 'Demasiadas solicitudes. Intenta más tarde.',
    500: 'Error del servidor. Intenta más tarde.',
    502: 'Servidor no disponible. Intenta más tarde.',
    503: 'Servicio no disponible. Intenta más tarde.',
  };

  const message = statusMessages[status] || ERROR_MESSAGES.GENERIC_ERROR;

  return new ApiError(
    message,
    status,
    data?.code || `HTTP_${status}`,
    data?.details || null
  );
};

/**
 * Formatear errores de validación de Zod
 * @param {import('zod').ZodError} error 
 * @returns {Object} - Objeto con errores por campo
 */
export const formatZodErrors = (error) => {
  const errors = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });
  
  return errors;
};

/**
 * Obtener mensaje de error amigable
 * @param {Error} error 
 * @returns {string}
 */
export const getErrorMessage = (error) => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof AuthError) {
    return error.message;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return ERROR_MESSAGES.GENERIC_ERROR;
};

/**
 * Log de errores para desarrollo
 * @param {Error} error 
 * @param {string} context 
 */
export const logError = (error, context = 'Unknown') => {
  if (import.meta.env.DEV) {
    console.group(`🔴 Error in ${context}`);
    console.error('Error:', error);
    if (error instanceof ApiError) {
      console.log('Status:', error.status);
      console.log('Code:', error.code);
      console.log('Details:', error.details);
    }
    console.groupEnd();
  }
};

export default {
  ApiError,
  AuthError,
  parseApiError,
  formatZodErrors,
  getErrorMessage,
  logError,
};
