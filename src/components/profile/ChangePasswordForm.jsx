/**
 * ChangePasswordForm Component
 * Formulario para cambiar la contraseña del usuario
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '../../utils/validators';
import { userApi } from '../../api/userApi';
import { PasswordStrengthIndicator } from '../auth';
import { ButtonSpinner } from '../common/LoadingSpinner';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

function ChangePasswordForm({ onSuccess, onCancel }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      await userApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      toast.success('Contraseña actualizada correctamente');
      reset();
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || 'Error al cambiar la contraseña');
    }
  };

  const PasswordToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
    >
      {show ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Contraseña actual */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-secondary">Contraseña actual</label>
        <div className="relative">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            {...register('currentPassword')}
            placeholder="Ingresa tu contraseña actual"
            className={cn(
              'w-full bg-hover text-primary placeholder-tertiary rounded-lg py-3 px-4 pr-12',
              'border border-theme input-accent transition-all duration-300',
              errors.currentPassword && 'border-red-500 focus:ring-red-500'
            )}
          />
          <PasswordToggle show={showCurrentPassword} onToggle={() => setShowCurrentPassword(!showCurrentPassword)} />
        </div>
        {errors.currentPassword && (
          <p className="text-red-500 text-xs">{errors.currentPassword.message}</p>
        )}
      </div>

      {/* Nueva contraseña */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-secondary">Nueva contraseña</label>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            {...register('newPassword')}
            placeholder="Ingresa tu nueva contraseña"
            className={cn(
              'w-full bg-hover text-primary placeholder-tertiary rounded-lg py-3 px-4 pr-12',
              'border border-theme input-accent transition-all duration-300',
              errors.newPassword && 'border-red-500 focus:ring-red-500'
            )}
          />
          <PasswordToggle show={showNewPassword} onToggle={() => setShowNewPassword(!showNewPassword)} />
        </div>
        {errors.newPassword && (
          <p className="text-red-500 text-xs">{errors.newPassword.message}</p>
        )}
        {newPassword && <PasswordStrengthIndicator password={newPassword} />}
      </div>

      {/* Confirmar contraseña */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-secondary">Confirmar contraseña</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            placeholder="Confirma tu nueva contraseña"
            className={cn(
              'w-full bg-hover text-primary placeholder-tertiary rounded-lg py-3 px-4 pr-12',
              'border border-theme input-accent transition-all duration-300',
              errors.confirmPassword && 'border-red-500 focus:ring-red-500'
            )}
          />
          <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary py-3 rounded-lg font-medium"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 btn-accent py-3 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <ButtonSpinner />
              Actualizando...
            </>
          ) : (
            <span>Cambiar contraseña</span>
          )}
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
