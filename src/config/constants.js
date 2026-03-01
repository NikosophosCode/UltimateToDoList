/**
 * Constantes de la aplicación
 * Configuración centralizada para toda la app
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Auth Configuration
export const AUTH_CONFIG = {
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',
  TOKEN_EXPIRY_BUFFER: 60 * 1000, // 1 minuto antes de expiración
};

// Password Policy
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,
};

// OAuth Configuration
export const OAUTH_CONFIG = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID || '',
  ENABLE_GOOGLE_AUTH: import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true',
  ENABLE_FACEBOOK_AUTH: import.meta.env.VITE_ENABLE_FACEBOOK_AUTH === 'true',
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  AVATAR_DIMENSIONS: {
    width: 200,
    height: 200,
  },
};

// Rate Limiting (frontend)
export const RATE_LIMIT = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  CALENDAR: '/calendar',
  ANALYTICS: '/analytics',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu internet.',
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos.',
  EMAIL_EXISTS: 'Ya existe una cuenta con este email.',
  WEAK_PASSWORD: 'La contraseña no cumple con los requisitos de seguridad.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  GENERIC_ERROR: 'Ha ocurrido un error. Por favor, intenta nuevamente.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: '¡Bienvenido de vuelta!',
  REGISTER: '¡Cuenta creada exitosamente!',
  LOGOUT: 'Has cerrado sesión correctamente.',
  PASSWORD_CHANGED: 'Contraseña actualizada correctamente.',
  PASSWORD_RESET_SENT: 'Se ha enviado un enlace de recuperación a tu email.',
  PROFILE_UPDATED: 'Perfil actualizado correctamente.',
};
