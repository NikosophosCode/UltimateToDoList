/**
 * Auth API Service
 * Endpoints de autenticación
 */

import { api } from './axios';

/**
 * Servicio de autenticación
 */
export const authApi = {
  /**
   * Iniciar sesión con email y contraseña
   * @param {Object} credentials - { email, password, rememberMe }
   * @returns {Promise<{ user, accessToken, refreshToken }>}
   */
  async login(credentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe || false,
    });
    return response.data;
  },

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - { name, email, password }
   * @returns {Promise<{ user, accessToken, refreshToken }>}
   */
  async register(userData) {
    const response = await api.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
    return response.data;
  },

  /**
   * Cerrar sesión
   * @param {string} refreshToken 
   * @returns {Promise<void>}
   */
  async logout(refreshToken) {
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      // Ignorar errores de logout, el token se limpiará localmente
      console.warn('Logout request failed:', error);
    }
  },

  /**
   * Refrescar access token
   * @param {string} refreshToken 
   * @returns {Promise<{ accessToken, refreshToken? }>}
   */
  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Obtener usuario actual
   * @returns {Promise<User>}
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  /**
   * Login con Google OAuth
   * @param {string} credential - Token de Google
   * @returns {Promise<{ user, accessToken, refreshToken }>}
   */
  async googleLogin(credential) {
    const response = await api.post('/auth/google', { token: credential });
    return response.data;
  },

  /**
   * Login con Facebook OAuth
   * @param {string} accessToken - Token de Facebook
   * @param {string} userId - ID de usuario de Facebook
   * @returns {Promise<{ user, accessToken, refreshToken }>}
   */
  async facebookLogin(accessToken, userId) {
    const response = await api.post('/auth/facebook', {
      accessToken,
      userId,
    });
    return response.data;
  },

  /**
   * Solicitar recuperación de contraseña
   * @param {string} email 
   * @returns {Promise<{ message: string }>}
   */
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Resetear contraseña con token
   * @param {string} token - Token de reset
   * @param {string} newPassword 
   * @returns {Promise<{ message: string }>}
   */
  async resetPassword(token, newPassword) {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },

  /**
   * Verificar email con token
   * @param {string} token 
   * @returns {Promise<{ message: string }>}
   */
  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Reenviar email de verificación
   * @returns {Promise<{ message: string }>}
   */
  async resendVerificationEmail() {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  },

  /**
   * Validar token de reset
   * @param {string} token 
   * @returns {Promise<{ valid: boolean }>}
   */
  async validateResetToken(token) {
    const response = await api.get(`/auth/validate-reset-token/${token}`);
    return response.data;
  },
};

export default authApi;
