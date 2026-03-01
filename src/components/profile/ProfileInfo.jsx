/**
 * ProfileInfo Component
 * Sección de información del perfil con capacidad de edición
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/userApi';
import { ButtonSpinner } from '../common/LoadingSpinner';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

function ProfileInfo() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
    },
  });

  const handleEdit = () => {
    reset({ name: user?.name || '' });
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset({ name: user?.name || '' });
    setIsEditing(false);
  };

  const onSubmit = async (data) => {
    try {
      const updated = await userApi.updateProfile({ name: data.name });
      updateUser({ name: updated.name || data.name });
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || 'Error al actualizar el perfil');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
    });
  };

  const memberSince = formatDate(user?.created_at || user?.createdAt);

  return (
    <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-primary font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Información Personal
        </h2>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="text-accent text-sm font-medium hover:underline"
          >
            Editar
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-secondary">Nombre</label>
            <input
              type="text"
              {...register('name', { 
                required: 'El nombre es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                maxLength: { value: 50, message: 'Máximo 50 caracteres' },
              })}
              className={cn(
                'w-full bg-hover text-primary placeholder-tertiary rounded-lg py-3 px-4',
                'border border-theme input-accent transition-all duration-300',
                errors.name && 'border-red-500'
              )}
              placeholder="Tu nombre"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-secondary">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-hover text-tertiary rounded-lg py-3 px-4 border border-theme cursor-not-allowed opacity-60"
            />
            <p className="text-xs text-tertiary">El email no se puede cambiar</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 btn-secondary py-2.5 rounded-lg text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="flex-1 btn-accent py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <ButtonSpinner />
                  Guardando...
                </>
              ) : (
                <span>Guardar</span>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-secondary text-sm">Nombre</span>
            <span className="text-primary font-medium">{user?.name || 'Sin nombre'}</span>
          </div>
          <div className="border-t border-theme" />
          <div className="flex items-center justify-between py-2">
            <span className="text-secondary text-sm">Email</span>
            <span className="text-primary font-medium text-right truncate ml-4 max-w-[200px]">{user?.email || 'N/A'}</span>
          </div>
          <div className="border-t border-theme" />
          <div className="flex items-center justify-between py-2">
            <span className="text-secondary text-sm">Miembro desde</span>
            <span className="text-primary font-medium">{memberSince}</span>
          </div>
          {user?.email_verified !== undefined && (
            <>
              <div className="border-t border-theme" />
              <div className="flex items-center justify-between py-2">
                <span className="text-secondary text-sm">Email verificado</span>
                {(user.email_verified || user.emailVerified) ? (
                  <span className="flex items-center gap-1 text-green-500 text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verificado
                  </span>
                ) : (
                  <span className="text-yellow-500 text-sm font-medium">Pendiente</span>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileInfo;
