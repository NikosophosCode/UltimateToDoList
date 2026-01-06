import React from 'react';

/**
 * ConfirmDialog Component
 * Diálogo de confirmación para acciones destructivas como eliminar tareas
 */
function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2d1b3d] rounded-2xl p-6 w-full max-w-sm">
        {/* Icono de advertencia */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h3 className="text-white text-xl font-semibold text-center mb-2">
          {title || 'Confirm Action'}
        </h3>

        {/* Mensaje */}
        <p className="text-gray-300 text-center mb-6">
          {message || 'Are you sure you want to proceed?'}
        </p>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#3d2852] text-white py-3 rounded-lg hover:bg-[#4a2f5e] transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
