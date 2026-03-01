/**
 * AvatarUpload Component
 * Componente para subir y gestionar la imagen de perfil del usuario
 */

import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/userApi';
import { toast } from 'sonner';
import { UPLOAD_CONFIG } from '../../config/constants';
import { ButtonSpinner } from '../common/LoadingSpinner';

function AvatarUpload() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const getInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Formato no soportado. Usa JPG, PNG o WebP.');
      return;
    }

    // Validar tamaño
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      toast.error('La imagen no puede superar los 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const result = await userApi.uploadAvatar(formData, (progress) => {
        setUploadProgress(progress);
      });

      updateUser({ avatarUrl: result.avatarUrl || result.avatar_url });
      toast.success('Avatar actualizado correctamente');
    } catch (err) {
      toast.error(err.message || 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setShowMenu(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setIsUploading(true);
      await userApi.deleteAvatar();
      updateUser({ avatarUrl: null, avatar_url: null });
      toast.success('Avatar eliminado');
    } catch (err) {
      toast.error(err.message || 'Error al eliminar el avatar');
    } finally {
      setIsUploading(false);
      setShowMenu(false);
    }
  };

  const handleUseOAuthAvatar = async (provider) => {
    try {
      setIsUploading(true);
      const result = await userApi.useOAuthAvatar(provider);
      updateUser({ avatarUrl: result.avatarUrl || result.avatar_url });
      toast.success(`Avatar de ${provider === 'google' ? 'Google' : 'Facebook'} aplicado`);
    } catch (err) {
      toast.error(err.message || 'Error al obtener avatar del proveedor');
    } finally {
      setIsUploading(false);
      setShowMenu(false);
    }
  };

  const avatarUrl = user?.avatarUrl || user?.avatar_url;
  const hasGoogle = user?.google_id || user?.googleId;
  const hasFacebook = user?.facebook_id || user?.facebookId;

  return (
    <div className="relative flex flex-col items-center">
      {/* Avatar */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isUploading}
        className="relative group"
      >
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg ring-4 ring-transparent hover:ring-[var(--accent-from)]/30 transition-all duration-300">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user?.name || 'Avatar'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-accent flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{getInitials()}</span>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-[var(--accent-from)] animate-spin" />
            {uploadProgress > 0 && (
              <span className="absolute text-white text-xs font-bold">{uploadProgress}%</span>
            )}
          </div>
        )}
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Menu dropdown */}
      {showMenu && !isUploading && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute top-28 z-20 bg-card border border-theme rounded-xl shadow-xl overflow-hidden min-w-[200px]">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-primary hover:bg-hover transition-colors"
            >
              <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Subir imagen
            </button>

            {hasGoogle && (
              <button
                onClick={() => handleUseOAuthAvatar('google')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-primary hover:bg-hover transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Usar foto de Google
              </button>
            )}

            {hasFacebook && (
              <button
                onClick={() => handleUseOAuthAvatar('facebook')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-primary hover:bg-hover transition-colors"
              >
                <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Usar foto de Facebook
              </button>
            )}

            {avatarUrl && (
              <button
                onClick={handleDeleteAvatar}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors border-t border-theme"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar avatar
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AvatarUpload;
