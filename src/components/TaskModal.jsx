import React from 'react';

/**
 * TaskModal Component
 * Modal para crear o editar una tarea
 * Compatible con el backend API (title, dueDate, startTime, endTime, color, priority)
 * Soporta temas claro/oscuro y colores de acento dinámicos
 */
function TaskModal({ isOpen, onClose, onSave, initialTask = null }) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [startTime, setStartTime] = React.useState('08:00');
  const [endTime, setEndTime] = React.useState('09:00');
  const [color, setColor] = React.useState('#8b5cf6');
  const [priority, setPriority] = React.useState('medium');

  // Sincronizar con initialTask cuando cambia
  React.useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || initialTask.text || '');
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate || initialTask.due_date || '');
      setStartTime(initialTask.startTime || initialTask.start_time || '08:00');
      setEndTime(initialTask.endTime || initialTask.end_time || '09:00');
      setColor(initialTask.color || '#8b5cf6');
      setPriority(initialTask.priority || 'medium');
    } else {
      resetForm();
    }
  }, [initialTask, isOpen]);

  const colors = [
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
  ];

  const priorities = [
    { label: 'Baja', value: 'low', color: 'text-green-500' },
    { label: 'Media', value: 'medium', color: 'text-yellow-500' },
    { label: 'Alta', value: 'high', color: 'text-red-500' },
  ];

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setStartTime('08:00');
    setEndTime('09:00');
    setColor('#8b5cf6');
    setPriority('medium');
  };

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        text: title,
        title,
        description,
        dueDate: dueDate || null,
        timeRange: `${startTime} - ${endTime}`,
        startTime,
        endTime,
        color,
        priority,
        completed: initialTask?.completed || false,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="modal-content rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-primary text-xl font-semibold">
            {initialTask ? 'Editar Tarea' : 'Nueva Tarea'}
          </h3>
          <button
            onClick={handleClose}
            className="text-secondary hover:text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Task Title */}
        <div className="mb-4">
          <label className="text-secondary text-sm mb-2 block">Nombre de la tarea</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ingresa el nombre de la tarea..."
            className="w-full bg-hover text-primary placeholder-tertiary rounded-lg py-3 px-4 border border-theme input-accent transition-all duration-300"
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-secondary text-sm mb-2 block">Descripción (opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Agrega una descripción..."
            rows={2}
            className="w-full bg-hover text-primary placeholder-tertiary rounded-lg py-3 px-4 border border-theme input-accent transition-all duration-300 resize-none"
          />
        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label className="text-secondary text-sm mb-2 block">Fecha</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-hover text-primary rounded-lg py-3 px-4 border border-theme input-accent transition-all duration-300"
          />
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-secondary text-sm mb-2 block">Hora inicio</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-hover text-primary rounded-lg py-3 px-4 border border-theme input-accent transition-all duration-300"
            />
          </div>
          <div>
            <label className="text-secondary text-sm mb-2 block">Hora fin</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-hover text-primary rounded-lg py-3 px-4 border border-theme input-accent transition-all duration-300"
            />
          </div>
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="text-secondary text-sm mb-2 block">Prioridad</label>
          <div className="flex gap-2">
            {priorities.map((p) => (
              <button
                key={p.value}
                onClick={() => setPriority(p.value)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                  priority === p.value
                    ? 'border-[var(--accent-from)] bg-[var(--accent-from)]/10 text-primary'
                    : 'border-theme bg-hover text-secondary hover:text-primary'
                }`}
              >
                <span className={priority === p.value ? p.color : ''}>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div className="mb-6">
          <label className="text-secondary text-sm mb-2 block">Color</label>
          <div className="flex gap-3">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-10 h-10 rounded-full transition-all ${
                  color === c.value ? 'ring-2 ring-accent-dynamic ring-offset-2 ring-offset-card scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.value }}
                aria-label={c.name}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 btn-secondary py-3 rounded-lg font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 btn-accent py-3 rounded-lg font-medium disabled:opacity-50"
          >
            <span>{initialTask ? 'Actualizar' : 'Crear'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
