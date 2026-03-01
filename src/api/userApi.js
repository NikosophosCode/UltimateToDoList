/**
 * User API Service
 * Endpoints de usuario
 */

import { api } from './axios';

/**
 * Servicio de usuario
 */
export const userApi = {
  /**
   * Obtener perfil del usuario actual
   * @returns {Promise<User>}
   */
  async getProfile() {
    const response = await api.get('/user/profile');
    return response.data.user;
  },

  /**
   * Actualizar perfil del usuario
   * @param {Object} data - { name, timezone, language }
   * @returns {Promise<User>}
   */
  async updateProfile(data) {
    const response = await api.put('/user/profile', data);
    return response.data.user;
  },

  /**
   * Cambiar contraseña
   * @param {Object} data - { currentPassword, newPassword }
   * @returns {Promise<{ message: string }>}
   */
  async changePassword(data) {
    const response = await api.put('/user/password', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    return response.data;
  },

  /**
   * Subir avatar
   * @param {FormData} formData - FormData con el archivo
   * @param {Function} onProgress - Callback de progreso
   * @returns {Promise<{ avatarUrl: string }>}
   */
  async uploadAvatar(formData, onProgress) {
    const response = await api.upload('/user/avatar', formData, onProgress);
    return response.data;
  },

  /**
   * Usar avatar de proveedor OAuth
   * @param {'google' | 'facebook'} provider 
   * @returns {Promise<{ avatarUrl: string }>}
   */
  async useOAuthAvatar(provider) {
    const response = await api.post('/user/avatar/oauth', { provider });
    return response.data;
  },

  /**
   * Eliminar avatar
   * @returns {Promise<{ message: string }>}
   */
  async deleteAvatar() {
    const response = await api.delete('/user/avatar');
    return response.data;
  },

  /**
   * Obtener cuentas OAuth vinculadas
   * @returns {Promise<{ google: boolean, facebook: boolean, hasPassword: boolean }>}
   */
  async getLinkedAccounts() {
    const response = await api.get('/user/linked-accounts');
    return response.data.linkedAccounts;
  },

  /**
   * Vincular cuenta OAuth
   * @param {'google' | 'facebook'} provider 
   * @param {string} token 
   * @returns {Promise<{ message: string }>}
   */
  async linkOAuthAccount(provider, token) {
    const response = await api.post(`/user/link/${provider}`, { token });
    return response.data;
  },

  /**
   * Desvincular cuenta OAuth
   * @param {'google' | 'facebook'} provider 
   * @returns {Promise<{ message: string }>}
   */
  async unlinkOAuthAccount(provider) {
    const response = await api.delete(`/user/link/${provider}`);
    return response.data;
  },

  /**
   * Obtener preferencias del usuario
   * @returns {Promise<Object>}
   */
  async getPreferences() {
    const response = await api.get('/user/preferences');
    return response.data;
  },

  /**
   * Actualizar preferencias del usuario
   * @param {Object} preferences 
   * @returns {Promise<Object>}
   */
  async updatePreferences(preferences) {
    const response = await api.put('/user/preferences', preferences);
    return response.data;
  },

  /**
   * Obtener estadísticas del usuario
   * @returns {Promise<Object>}
   */
  async getStats() {
    const response = await api.get('/user/stats');
    return response.data.stats;
  },

  /**
   * Eliminar cuenta
   * @param {string} password - Contraseña para confirmar
   * @returns {Promise<{ message: string }>}
   */
  async deleteAccount(password) {
    const response = await api.delete('/user/account', {
      data: { password },
    });
    return response.data;
  },

  /**
   * Exportar datos del usuario
   * @returns {Promise<Blob>}
   */
  async exportData() {
    const response = await api.get('/user/export', {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default userApi;
