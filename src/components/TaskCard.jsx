import React from 'react';

/**
 * TaskCard Component
 * Tarjeta de tarea individual con título, horario, checkbox, menú de opciones y barra de color
 */
function TaskCard({ 
  title, 
  timeRange, 
  completed = false, 
  accentColor = "#8b5cf6", 
  onToggle,
  onEdit,
  onDelete
}) {
  const [isChecked, setIsChecked] = React.useState(completed);
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef(null);

  // Sincronizar el estado del checkbox con la prop completed
  React.useEffect(() => {
    setIsChecked(completed);
  }, [completed]);

  // Cerrar menú al hacer click fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    if (onToggle) onToggle(!isChecked);
  };

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) onEdit();
  };

  const handleDelete = () => {
    setShowMenu(false);
    if (onDelete) onDelete();
  };

  return (
    <div className="bg-[#3d2852] rounded-2xl p-4 mb-3 relative">
      {/* Barra de color lateral */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="flex items-start justify-between ml-3">
        <div className="flex-1">
          {/* Icono de lista */}
          <div className="mb-2">
            <div className="flex gap-1">
              <div className="h-0.5 w-6" style={{ backgroundColor: accentColor }} />
              <div className="h-0.5 w-4" style={{ backgroundColor: accentColor }} />
            </div>
          </div>
          
          {/* Título de la tarea */}
          <h3 className="text-white text-base font-medium mb-2">{title}</h3>
          
          {/* Rango de tiempo */}
          <p className="text-gray-400 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {timeRange}
          </p>
        </div>

        {/* Menú de opciones */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Menú desplegable */}
          {showMenu && (
            <div className="absolute right-0 top-8 bg-[#2d1b3d] rounded-lg shadow-2xl border border-gray-600 py-2 min-w-[160px] z-50 overflow-hidden">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-3 text-left text-sm text-white hover:bg-[#3d2852] transition-colors flex items-center gap-3 border-b border-red-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="font-medium">Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-3 text-left text-sm text-white hover:bg-[#3d2852] transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="font-medium">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkbox */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={handleToggle}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            isChecked 
              ? 'bg-transparent border-gray-500' 
              : 'bg-transparent border-gray-500 hover:border-gray-400'
          }`}
        >
          {isChecked && (
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
