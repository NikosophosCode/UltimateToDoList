/**
 * DeleteAccount Component
 * Componente para eliminar la cuenta del usuario con confirmación
 */

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/userApi';
import { ButtonSpinner } from '../common/LoadingSpinner';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

function DeleteAccount() {
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = confirmText === 'ELIMINAR' && password.length > 0;

  const handleDelete = async () => {
    if (!canDelete) return;

    setIsDeleting(true);
    try {
      await userApi.deleteAccount(password);
      toast.success('Cuenta eliminada correctamente');
      await logout();
    } catch (err) {
      toast.error(err.message || 'Error al eliminar la cuenta');
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setPassword('');
    setConfirmText('');
  };

  return (
    <div className="bg-card rounded-xl p-4 border border-red-500/20 shadow-sm">
      <h2 className="text-red-500 font-semibold mb-2 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Zona de Peligro
      </h2>
      <p className="text-secondary text-sm mb-3">
        Eliminar tu cuenta es permanente. Se borrarán todos tus datos, tareas y configuraciones.
      </p>

      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-red-500 border border-red-500/30 hover:bg-red-500/10 transition-colors"
        >
          Eliminar mi cuenta
        </button>
      ) : (
        <div className="space-y-3 pt-2 border-t border-red-500/20">
          <div className="space-y-2">
            <label className="text-sm text-secondary">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className={cn(
                'w-full bg-hover text-primary placeholder-tertiary rounded-lg py-3 px-4',
                'border border-theme input-accent transition-all duration-300'
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-secondary">
              Escribe <span className="text-red-500 font-mono font-bold">ELIMINAR</span> para confirmar
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              className={cn(
                'w-full bg-hover text-primary placeholder-tertiary rounded-lg py-3 px-4',
                'border border-theme input-accent transition-all duration-300'
              )}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 btn-secondary py-2.5 rounded-lg text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={!canDelete || isDeleting}
              className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <ButtonSpinner />
                  Eliminando...
                </>
              ) : (
                'Eliminar cuenta'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAccount;
