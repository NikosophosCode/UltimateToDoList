import React from 'react';

/**
 * ConfirmDialog Component
 * Diálogo de confirmación para acciones destructivas
 * Soporta temas claro/oscuro mediante CSS variables
 */
function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Eliminar', variant = 'danger' }) {
  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: 'text-red-500',
      iconBg: 'bg-red-500/15',
      confirmBtn: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: 'text-yellow-500',
      iconBg: 'bg-yellow-500/15',
      confirmBtn: 'bg-yellow-500 hover:bg-yellow-600',
    },
  };

  const style = variants[variant] || variants.danger;

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="modal-content rounded-2xl p-6 w-full max-w-sm">
        {/* Icono de advertencia */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full ${style.iconBg} flex items-center justify-center`}>
            <svg className={`w-8 h-8 ${style.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h3 className="text-primary text-xl font-semibold text-center mb-2">
          {title || 'Confirmar Acción'}
        </h3>

        {/* Mensaje */}
        <p className="text-secondary text-center mb-6">
          {message || '¿Estás seguro de que deseas continuar?'}
        </p>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary py-3 rounded-lg font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 ${style.confirmBtn} text-white py-3 rounded-lg transition-colors font-medium`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
