import React, { useState, useCallback, useMemo, useRef } from 'react';
import { taskApi, getLocalDateStr } from '../api/taskApi';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { LoadingSpinner } from '../components/common';
import { logError } from '../utils/errorHandler';
import { toast } from 'sonner';

/**
 * CalendarPage Component
 * Página de calendario con tareas por fecha
 * Obtiene las tareas del backend según la fecha seleccionada
 */
function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedDate, setLoadedDate] = useState(null);
  const initFetchDone = useRef(false);

  // Calcular información del mes actual
  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const cells = [];
    
    // Días del mes anterior
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, isCurrentMonth: false, date: null });
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      cells.push({ day: i, isCurrentMonth: true, date });
    }
    
    // Relleno al final para completar las filas
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, isCurrentMonth: false, date: null });
    }
    
    return cells;
  }, [viewDate]);

  const monthName = viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const today = new Date();

  const isToday = (date) => {
    if (!date) return false;
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const formatDateForApi = (date) => {
    return getLocalDateStr(date);
  };

  // Cargar tareas para la fecha seleccionada
  const fetchTasksForDate = useCallback(async (date) => {
    const dateStr = formatDateForApi(date);
    if (dateStr === loadedDate) return;
    
    setIsLoading(true);
    try {
      const response = await taskApi.getTasksByDate(dateStr);
      const rawTasks = Array.isArray(response) ? response : (response.tasks || response.data || []);
      setTasks(rawTasks.map(t => ({
        id: t.id,
        title: t.title || t.text || '',
        timeRange: formatTimeRange(t),
        completed: t.is_completed ?? t.isCompleted ?? t.completed ?? false,
        color: t.color || '#8b5cf6',
      })));
      setLoadedDate(dateStr);
    } catch (err) {
      logError(err, 'CalendarPage.fetchTasks');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [loadedDate]);

  const formatTimeRange = (task) => {
    const start = task.start_time || task.startTime;
    const end = task.end_time || task.endTime;
    if (start && end) {
      const formatT = (t) => {
        const [h, m] = t.split(':');
        const hr = parseInt(h, 10);
        return `${hr % 12 || 12}:${m}${hr >= 12 ? 'PM' : 'AM'}`;
      };
      return `${formatT(start)} - ${formatT(end)}`;
    }
    return task.timeRange || task.time_range || '';
  };

  const handleSelectDate = (cell) => {
    if (!cell.isCurrentMonth || !cell.date) return;
    setSelectedDate(cell.date);
    fetchTasksForDate(cell.date);
  };

  const handleToggleTask = async (taskId, completed) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed } : t));
    try {
      await taskApi.toggleTask(taskId, completed);
    } catch {
      // Revert
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !completed } : t));
      toast.error('Error al actualizar la tarea');
    }
  };

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setViewDate(new Date());
    setSelectedDate(new Date());
    fetchTasksForDate(new Date());
  };

  // Cargar tareas de hoy al montar (useRef previene doble-fetch en React StrictMode)
  React.useEffect(() => {
    if (initFetchDone.current) return;
    initFetchDone.current = true;
    fetchTasksForDate(selectedDate);
  }, []);

  const selectedDateStr = selectedDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Calendario</h1>
          <p className="text-secondary capitalize">{monthName}</p>
        </div>
        <button
          onClick={goToToday}
          className="text-sm font-medium text-accent hover:underline"
        >
          Hoy
        </button>
      </div>

      <div className="bg-card rounded-xl p-4 border border-theme shadow-sm mb-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-hover transition-colors text-secondary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-primary font-semibold capitalize">{monthName}</span>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-hover transition-colors text-secondary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center text-secondary text-xs font-semibold py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Grid de días */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleSelectDate(cell)}
              disabled={!cell.isCurrentMonth}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-all ${
                isSelected(cell.date) && cell.isCurrentMonth
                  ? 'bg-accent text-white font-bold shadow-md scale-105'
                  : isToday(cell.date) && cell.isCurrentMonth
                  ? 'ring-2 ring-[var(--accent-from)] text-primary font-bold'
                  : cell.isCurrentMonth
                  ? 'text-primary hover:bg-hover cursor-pointer'
                  : 'text-tertiary opacity-40'
              }`}
            >
              {cell.day}
            </button>
          ))}
        </div>
      </div>

      {/* Tareas del día seleccionado */}
      <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
        <h2 className="text-primary font-semibold mb-3 capitalize">
          {selectedDateStr}
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : tasks.length > 0 ? (
          <div>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                timeRange={task.timeRange}
                completed={task.completed}
                accentColor={task.color}
                onToggle={(completed) => handleToggleTask(task.id, completed)}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="No hay tareas para esta fecha" />
        )}
      </div>
    </div>
  );
}

export default CalendarPage;
