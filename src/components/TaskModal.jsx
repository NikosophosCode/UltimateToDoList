import React from 'react';

/**
 * TaskModal Component
 * Modal para crear o editar una tarea
 */
function TaskModal({ isOpen, onClose, onSave, initialTask = null }) {
  const [title, setTitle] = React.useState(initialTask?.text || '');
  const [startTime, setStartTime] = React.useState(initialTask?.startTime || '08:00');
  const [endTime, setEndTime] = React.useState(initialTask?.endTime || '09:00');
  const [color, setColor] = React.useState(initialTask?.color || '#8b5cf6');

  const colors = [
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
  ];

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        text: title,
        timeRange: `${startTime} - ${endTime}`,
        startTime,
        endTime,
        color,
        completed: initialTask?.completed || false,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setStartTime('08:00');
    setEndTime('09:00');
    setColor('#8b5cf6');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2d1b3d] rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-semibold">
            {initialTask ? 'Edit Task' : 'New Task'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Task Title */}
        <div className="mb-4">
          <label className="text-gray-300 text-sm mb-2 block">Task Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task name..."
            className="w-full bg-[#3d2852] text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
          />
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[#3d2852] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm mb-2 block">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-[#3d2852] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="mb-6">
          <label className="text-gray-300 text-sm mb-2 block">Accent Color</label>
          <div className="flex gap-3">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-10 h-10 rounded-full transition-all ${
                  color === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-[#2d1b3d] scale-110' : 'hover:scale-105'
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
            className="flex-1 bg-[#3d2852] text-white py-3 rounded-lg hover:bg-[#4a2f5e] transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
          >
            {initialTask ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
