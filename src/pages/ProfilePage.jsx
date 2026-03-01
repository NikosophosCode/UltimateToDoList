import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userApi } from '../api/userApi';
import { AvatarUpload, ProfileInfo, ChangePasswordForm, LinkedAccounts, DeleteAccount } from '../components/profile';
import { logError } from '../utils/errorHandler';

/**
 * ProfilePage Component
 * Página de perfil del usuario con todas las funcionalidades:
 * - Avatar upload
 * - Información personal editable
 * - Cambio de contraseña
 * - Cuentas OAuth vinculadas
 * - Estadísticas de usuario
 * - Eliminación de cuenta
 */
function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await userApi.getStats();
      setStats({
        ...data,
        pendingTasks: (data?.totalTasks ?? 0) - (data?.completedTasks ?? 0),
      });
    } catch (err) {
      logError(err, 'ProfilePage.fetchStats');
    }
  };

  return (
    <div className="px-6 py-8">
      {/* Avatar & User Name */}
      <div className="text-center mb-8">
        <AvatarUpload />
        <h1 className="text-2xl font-bold text-primary mt-4 mb-1">{user?.name || 'Usuario'}</h1>
        <p className="text-secondary">{user?.email}</p>
      </div>

      <div className="space-y-4">
        {/* Stats Card */}
        {stats && (
          <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
            <h2 className="text-primary font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Estadísticas
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-hover">
                <div className="text-2xl font-bold text-accent">{stats.totalTasks ?? stats.total_tasks ?? 0}</div>
                <div className="text-xs text-secondary mt-1">Total</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-hover">
                <div className="text-2xl font-bold text-green-500">{stats.completedTasks ?? stats.completed_tasks ?? 0}</div>
                <div className="text-xs text-secondary mt-1">Completadas</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-hover">
                <div className="text-2xl font-bold text-yellow-500">{stats.pendingTasks ?? stats.pending_tasks ?? 0}</div>
                <div className="text-xs text-secondary mt-1">Pendientes</div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Info */}
        <ProfileInfo />

        {/* Change Password */}
        <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-primary font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Contraseña
            </h2>
            {!showChangePassword && (
              <button
                onClick={() => setShowChangePassword(true)}
                className="text-accent text-sm font-medium hover:underline"
              >
                Cambiar
              </button>
            )}
          </div>
          
          {showChangePassword ? (
            <ChangePasswordForm
              onSuccess={() => setShowChangePassword(false)}
              onCancel={() => setShowChangePassword(false)}
            />
          ) : (
            <p className="text-secondary text-sm">
              Tu contraseña fue establecida al crear tu cuenta. Haz clic en "Cambiar" para actualizarla.
            </p>
          )}
        </div>

        {/* Linked Accounts */}
        <LinkedAccounts />

        {/* Delete Account */}
        <DeleteAccount />
      </div>
    </div>
  );
}

export default ProfilePage;
