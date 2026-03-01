import React, { useState, useEffect, useMemo } from 'react';
import { userApi } from '../api/userApi';
import { taskApi } from '../api/taskApi';
import { LoadingSpinner } from '../components/common';
import { logError } from '../utils/errorHandler';

/**
 * AnalyticsPage Component
 * Página de estadísticas y análisis de productividad
 * Obtiene datos reales del backend
 */
function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Obtener estadísticas del usuario
      const [userStats, allTasks] = await Promise.all([
        userApi.getStats().catch(() => null),
        taskApi.getTasks().catch(() => []),
      ]);

      const rawTasks = Array.isArray(allTasks) ? allTasks : (allTasks.tasks || allTasks.data || []);

      // Calcular stats si no vienen del backend
      const total = userStats?.totalTasks ?? userStats?.total_tasks ?? rawTasks.length;
      const completed = userStats?.completedTasks ?? userStats?.completed_tasks ?? 
        rawTasks.filter(t => t.is_completed ?? t.isCompleted ?? t.completed).length;
      const pending = total - completed;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

      setStats({ total, completed, pending, rate });

      // Calcular datos semanales
      calculateWeeklyData(rawTasks);
    } catch (err) {
      logError(err, 'AnalyticsPage.fetchAnalytics');
      setStats({ total: 0, completed: 0, pending: 0, rate: 0 });
      setWeeklyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWeeklyData = (tasks) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const weekly = days.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const dateStr = date.toISOString().split('T')[0];

      const dayTasks = tasks.filter(t => {
        const taskDate = t.due_date || t.dueDate || t.created_at || t.createdAt;
        if (!taskDate) return false;
        return taskDate.toString().startsWith(dateStr);
      });

      const total = dayTasks.length;
      const completed = dayTasks.filter(t => t.is_completed ?? t.isCompleted ?? t.completed).length;

      return { day, total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    });

    setWeeklyData(weekly);
  };

  const maxWeeklyTasks = useMemo(() => {
    return Math.max(...weeklyData.map(d => d.total), 1);
  }, [weeklyData]);

  const productivityScore = useMemo(() => {
    if (!stats) return 0;
    // Score basado en tasa de completado y actividad
    return Math.min(stats.rate + (stats.total > 0 ? 10 : 0), 100);
  }, [stats]);

  const circumference = 2 * Math.PI * 56; // r=56
  const dashOffset = circumference - (productivityScore / 100) * circumference;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" message="Cargando analíticas..." />
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Analíticas</h1>
        <p className="text-secondary">Tus insights de productividad</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4">
          <div className="text-purple-200 text-sm mb-1">Total Tareas</div>
          <div className="text-white text-3xl font-bold">{stats?.total ?? 0}</div>
        </div>
        <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-4">
          <div className="text-pink-200 text-sm mb-1">Completadas</div>
          <div className="text-white text-3xl font-bold">{stats?.completed ?? 0}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4">
          <div className="text-blue-200 text-sm mb-1">Pendientes</div>
          <div className="text-white text-3xl font-bold">{stats?.pending ?? 0}</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4">
          <div className="text-green-200 text-sm mb-1">Tasa de Éxito</div>
          <div className="text-white text-3xl font-bold">{stats?.rate ?? 0}%</div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-card rounded-xl p-6 border border-theme shadow-sm mb-6">
        <h2 className="text-primary font-semibold mb-4">Progreso Semanal</h2>
        <div className="space-y-3">
          {weeklyData.map((day) => (
            <div key={day.day} className="flex items-center gap-3">
              <span className="text-secondary w-10 text-sm">{day.day}</span>
              <div className="flex-1 bg-hover rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${day.total > 0 ? Math.max((day.completed / maxWeeklyTasks) * 100, 5) : 0}%` }}
                />
              </div>
              <span className="text-xs text-tertiary w-8 text-right">
                {day.completed}/{day.total}
              </span>
            </div>
          ))}
        </div>
        {weeklyData.every(d => d.total === 0) && (
          <p className="text-center text-tertiary text-sm mt-4">No hay datos para esta semana</p>
        )}
      </div>

      {/* Productivity Score */}
      <div className="bg-card rounded-xl p-6 border border-theme shadow-sm">
        <h2 className="text-primary font-semibold mb-4">Puntaje de Productividad</h2>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-hover"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-from)" />
                  <stop offset="100%" stopColor="var(--accent-to)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-primary">{productivityScore}</span>
              <span className="text-sm text-secondary">Puntaje</span>
            </div>
          </div>
        </div>
        <p className="text-center text-tertiary text-sm mt-4">
          {productivityScore >= 80 ? '¡Excelente productividad!' :
           productivityScore >= 50 ? 'Buen progreso, sigue así' :
           productivityScore > 0 ? 'Hay espacio para mejorar' :
           'Crea tareas para empezar a medir tu productividad'}
        </p>
      </div>
    </div>
  );
}

export default AnalyticsPage;
