/**
 * useTasks Hook
 * Hook personalizado para gestión de tareas con el backend API
 * Reemplaza el uso de useLocalStorage para tareas
 */

import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../api/taskApi';
import { logError } from '../utils/errorHandler';
import { toast } from 'sonner';

/**
 * Normaliza una tarea del backend al formato del frontend
 * Maneja tanto snake_case como camelCase del backend
 */
function normalizeTask(task) {
  return {
    id: task.id,
    title: task.title || task.text || '',
    text: task.title || task.text || '',
    description: task.description || '',
    completed: task.is_completed ?? task.isCompleted ?? task.completed ?? false,
    dueDate: task.due_date || task.dueDate || null,
    startTime: task.start_time || task.startTime || null,
    endTime: task.end_time || task.endTime || null,
    timeRange: formatTimeRange(task),
    color: task.color || '#8b5cf6',
    priority: task.priority || 'medium',
    position: task.position ?? 0,
    createdAt: task.created_at || task.createdAt || null,
    updatedAt: task.updated_at || task.updatedAt || null,
  };
}

/**
 * Formatea el rango de tiempo de una tarea
 */
function formatTimeRange(task) {
  const start = task.start_time || task.startTime;
  const end = task.end_time || task.endTime;
  
  if (start && end) {
    return `${formatTime(start)} - ${formatTime(end)}`;
  }
  if (task.timeRange || task.time_range) {
    return task.timeRange || task.time_range;
  }
  return '';
}

/**
 * Formatea hora de 24h a 12h AM/PM
 */
function formatTime(time) {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes}${ampm}`;
}

/**
 * Prepara datos de tarea para enviar al backend
 */
function prepareTaskForApi(taskData) {
  return {
    title: taskData.text || taskData.title,
    description: taskData.description || '',
    dueDate: taskData.dueDate || null,
    startTime: taskData.startTime || null,
    endTime: taskData.endTime || null,
    color: taskData.color || '#8b5cf6',
    priority: taskData.priority || 'medium',
    isCompleted: taskData.completed || false,
  };
}

/**
 * Custom hook para gestión de tareas
 * @param {Object} options - Opciones de configuración
 * @param {string} [options.date] - Fecha para filtrar tareas (YYYY-MM-DD)
 * @param {boolean} [options.todayOnly] - Si solo se muestran tareas de hoy
 * @param {Object} [options.filters] - Filtros adicionales
 * @returns {Object} Estado y acciones de tareas
 */
export function useTasks({ date, todayOnly = false, filters = {} } = {}) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  /**
   * Cargar tareas desde el backend
   */
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (date) {
        response = await taskApi.getTasksByDate(date);
      } else if (todayOnly) {
        response = await taskApi.getTodayTasks();
      } else {
        response = await taskApi.getTasks(filters);
      }

      // Normalizar respuesta - puede ser array directo o { tasks: [...] }
      const rawTasks = Array.isArray(response) ? response : (response.tasks || response.data || []);
      const normalized = rawTasks.map(normalizeTask);
      
      setTasks(normalized);
      updateStats(normalized);
    } catch (err) {
      logError(err, 'useTasks.fetchTasks');
      setError(err.message || 'Error al cargar tareas');
      
      // Si es un error de red, intentar cargar desde localStorage como fallback
      try {
        const localTasks = JSON.parse(localStorage.getItem('todos') || '[]');
        if (localTasks.length > 0) {
          const normalized = localTasks.map(normalizeTask);
          setTasks(normalized);
          updateStats(normalized);
        }
      } catch {
        // Ignorar errores de localStorage
      }
    } finally {
      setIsLoading(false);
    }
  }, [date, todayOnly, JSON.stringify(filters)]);

  /**
   * Actualizar estadísticas locales
   */
  const updateStats = (taskList) => {
    const total = taskList.length;
    const completed = taskList.filter(t => t.completed).length;
    setStats({
      total,
      completed,
      pending: total - completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  };

  /**
   * Crear nueva tarea
   */
  const createTask = useCallback(async (taskData) => {
    try {
      const apiData = prepareTaskForApi(taskData);
      const response = await taskApi.createTask(apiData);
      const newTask = normalizeTask(response.task || response);
      
      setTasks(prev => {
        const updated = [...prev, newTask];
        updateStats(updated);
        return updated;
      });
      
      toast.success('Tarea creada exitosamente');
      return { success: true, task: newTask };
    } catch (err) {
      logError(err, 'useTasks.createTask');
      toast.error(err.message || 'Error al crear la tarea');
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Actualizar tarea existente
   */
  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      const apiData = prepareTaskForApi(taskData);
      const response = await taskApi.updateTask(taskId, apiData);
      const updatedTask = normalizeTask(response.task || response);
      
      setTasks(prev => {
        const updated = prev.map(t => t.id === taskId ? updatedTask : t);
        updateStats(updated);
        return updated;
      });
      
      toast.success('Tarea actualizada');
      return { success: true, task: updatedTask };
    } catch (err) {
      logError(err, 'useTasks.updateTask');
      toast.error(err.message || 'Error al actualizar la tarea');
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Eliminar tarea (soft delete)
   */
  const deleteTask = useCallback(async (taskId) => {
    try {
      await taskApi.deleteTask(taskId);
      
      setTasks(prev => {
        const updated = prev.filter(t => t.id !== taskId);
        updateStats(updated);
        return updated;
      });
      
      toast.success('Tarea eliminada');
      return { success: true };
    } catch (err) {
      logError(err, 'useTasks.deleteTask');
      toast.error(err.message || 'Error al eliminar la tarea');
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Alternar completado de tarea
   */
  const toggleTask = useCallback(async (taskId, completed) => {
    // Optimistic update
    setTasks(prev => {
      const updated = prev.map(t => 
        t.id === taskId ? { ...t, completed } : t
      );
      updateStats(updated);
      return updated;
    });

    try {
      await taskApi.toggleTask(taskId, completed);
    } catch (err) {
      // Revertir optimistic update
      setTasks(prev => {
        const updated = prev.map(t => 
          t.id === taskId ? { ...t, completed: !completed } : t
        );
        updateStats(updated);
        return updated;
      });
      logError(err, 'useTasks.toggleTask');
      toast.error('Error al actualizar la tarea');
    }
  }, []);

  /**
   * Migrar tareas de localStorage al backend
   */
  const migrateFromLocalStorage = useCallback(async () => {
    try {
      const localTasks = JSON.parse(localStorage.getItem('todos') || '[]');
      
      if (localTasks.length === 0) return { migrated: 0 };
      
      const tasksToMigrate = localTasks.map(t => ({
        title: t.text || t.title,
        startTime: t.startTime || null,
        endTime: t.endTime || null,
        color: t.color || '#8b5cf6',
        isCompleted: t.completed || false,
      }));

      const result = await taskApi.migrateFromLocalStorage(tasksToMigrate);
      
      // Limpiar localStorage después de migrar
      localStorage.removeItem('todos');
      
      // Recargar tareas desde el backend
      await fetchTasks();
      
      toast.success(`${result.imported || tasksToMigrate.length} tareas migradas correctamente`);
      return result;
    } catch (err) {
      logError(err, 'useTasks.migrateFromLocalStorage');
      return { migrated: 0, error: err.message };
    }
  }, [fetchTasks]);

  // Cargar tareas al montar
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    stats,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    migrateFromLocalStorage,
  };
}

export default useTasks;
