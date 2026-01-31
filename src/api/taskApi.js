/**
 * Task API Service
 * Endpoints de tareas
 */

import { api } from './axios';

/**
 * Servicio de tareas
 */
export const taskApi = {
  /**
   * Obtener todas las tareas del usuario
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise<Task[]>}
   */
  async getTasks(params = {}) {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  /**
   * Obtener una tarea por ID
   * @param {string} id 
   * @returns {Promise<Task>}
   */
  async getTask(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Crear nueva tarea
   * @param {Object} taskData 
   * @returns {Promise<Task>}
   */
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  /**
   * Actualizar tarea
   * @param {string} id 
   * @param {Object} taskData 
   * @returns {Promise<Task>}
   */
  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  /**
   * Eliminar tarea
   * @param {string} id 
   * @returns {Promise<void>}
   */
  async deleteTask(id) {
    await api.delete(`/tasks/${id}`);
  },

  /**
   * Marcar tarea como completada/pendiente
   * @param {string} id 
   * @param {boolean} completed 
   * @returns {Promise<Task>}
   */
  async toggleTask(id, completed) {
    const response = await api.patch(`/tasks/${id}/toggle`, { completed });
    return response.data;
  },

  /**
   * Obtener tareas por fecha
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {Promise<Task[]>}
   */
  async getTasksByDate(date) {
    const response = await api.get('/tasks/by-date', { params: { date } });
    return response.data;
  },

  /**
   * Obtener tareas de hoy
   * @returns {Promise<Task[]>}
   */
  async getTodayTasks() {
    const response = await api.get('/tasks/today');
    return response.data;
  },

  /**
   * Reordenar tareas
   * @param {Array<{ id: string, position: number }>} order 
   * @returns {Promise<void>}
   */
  async reorderTasks(order) {
    await api.put('/tasks/reorder', { order });
  },

  /**
   * Migrar tareas desde localStorage
   * @param {Array<Object>} tasks 
   * @returns {Promise<{ imported: number, skipped: number }>}
   */
  async migrateFromLocalStorage(tasks) {
    const response = await api.post('/tasks/migrate', { tasks });
    return response.data;
  },
};

export default taskApi;
