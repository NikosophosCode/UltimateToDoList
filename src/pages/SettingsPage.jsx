import React, { useState, useCallback } from 'react';
import { useTheme, accentColors } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { userApi } from '../api/userApi';
import { taskApi } from '../api/taskApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import { logError } from '../utils/errorHandler';

/**
 * SettingsPage Component
 * Página de configuración de la aplicación
 */
function SettingsPage() {
  const { theme, accentColor, toggleTheme, changeAccentColor } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false);

  const currentAccentColor = accentColors.find(c => c.id === accentColor);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      logError(err, 'SettingsPage.handleLogout');
      toast.error('Error al cerrar sesión');
    }
  }, [logout, navigate]);

  const handleExportData = useCallback(async () => {
    setIsExporting(true);
    try {
      // Intentar exportar desde el backend
      const response = await userApi.exportData().catch(() => null);
      
      if (response && response.data) {
        // Si el backend devuelve un blob/archivo
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ultimate-todo-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Fallback: exportar tareas y datos locales
        const tasks = await taskApi.getTasks().catch(() => []);
        const rawTasks = Array.isArray(tasks) ? tasks : (tasks.tasks || tasks.data || []);
        const exportData = {
          exportedAt: new Date().toISOString(),
          tasks: rawTasks,
          settings: {
            theme,
            accentColor,
          }
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ultimate-todo-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      toast.success('Datos exportados exitosamente');
    } catch (err) {
      logError(err, 'SettingsPage.handleExportData');
      toast.error('Error al exportar datos');
    } finally {
      setIsExporting(false);
    }
  }, [theme, accentColor]);

  const handleClearCache = useCallback(() => {
    try {
      // Preservar tokens y configuración del tema
      const accessToken = sessionStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const savedTheme = localStorage.getItem('theme');
      const savedAccent = localStorage.getItem('accentColor');

      localStorage.clear();
      sessionStorage.clear();

      // Restaurar datos esenciales
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (accessToken) sessionStorage.setItem('accessToken', accessToken);
      if (savedTheme) localStorage.setItem('theme', savedTheme);
      if (savedAccent) localStorage.setItem('accentColor', savedAccent);

      toast.success('Caché limpiada correctamente');
      setShowClearCacheConfirm(false);
    } catch (err) {
      logError(err, 'SettingsPage.handleClearCache');
      toast.error('Error al limpiar caché');
    }
  }, []);

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Configuración</h1>
        <p className="text-secondary">Administra tus preferencias</p>
      </div>

      <div className="space-y-4">
        {/* Appearance */}
        <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
          <h2 className="text-primary font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            Apariencia
          </h2>
          <div className="space-y-3">
            {/* Theme Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-hover hover:bg-tertiary transition-colors border border-theme"
              >
                <span className="text-secondary">Tema</span>
                <div className="flex items-center gap-2">
                  <span className="text-accent font-medium capitalize">
                    {theme === 'dark' ? 'Oscuro' : 'Claro'}
                  </span>
                  <svg className={`w-4 h-4 text-secondary transition-transform ${showThemeMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {showThemeMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-theme rounded-lg shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => {
                      if (theme !== 'light') toggleTheme();
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 hover:bg-hover transition-colors ${theme === 'light' ? 'bg-hover' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-primary">Claro</span>
                    </div>
                    {theme === 'light' && (
                      <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (theme !== 'dark') toggleTheme();
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 hover:bg-hover transition-colors ${theme === 'dark' ? 'bg-hover' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                      <span className="text-primary">Oscuro</span>
                    </div>
                    {theme === 'dark' && (
                      <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Accent Color Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowColorMenu(!showColorMenu)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-hover hover:bg-tertiary transition-colors border border-theme"
              >
                <span className="text-secondary">Color de Acento</span>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${currentAccentColor.class} shadow-md`}></div>
                  <svg className={`w-4 h-4 text-secondary transition-transform ${showColorMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {showColorMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-theme rounded-lg shadow-lg z-10 overflow-hidden">
                  {accentColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        changeAccentColor(color.id);
                        setShowColorMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 hover:bg-hover transition-colors ${accentColor === color.id ? 'bg-hover' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${color.class} shadow-md`}></div>
                        <span className="text-primary">{color.name}</span>
                      </div>
                      {accentColor === color.id && (
                        <svg className="w-5 h-5" style={{ color: color.from }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
          <h2 className="text-primary font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Notificaciones
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-hover hover:bg-tertiary transition-colors border border-theme">
              <span className="text-secondary">Recordatorios</span>
              <div className="w-10 h-6 bg-accent rounded-full relative shadow-md">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-all"></div>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-hover hover:bg-tertiary transition-colors border border-theme">
              <span className="text-secondary">Resumen Diario</span>
              <div className="w-10 h-6 bg-tertiary border-2 border-theme rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-all"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
          <h2 className="text-primary font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Datos y Privacidad
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-hover hover:bg-tertiary transition-colors text-left border border-theme disabled:opacity-50"
            >
              <span className="text-secondary">
                {isExporting ? 'Exportando...' : 'Exportar Datos'}
              </span>
              {isExporting ? (
                <svg className="w-5 h-5 text-tertiary animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowClearCacheConfirm(true)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-hover hover:bg-tertiary transition-colors text-left border border-theme"
            >
              <span className="text-secondary">Limpiar Caché</span>
              <svg className="w-5 h-5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
          <h2 className="text-primary font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Acerca de
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3">
              <span className="text-secondary">Versión</span>
              <span className="text-tertiary">1.0.0</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-secondary">Desarrollado con</span>
              <span className="text-tertiary">React + Vite</span>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-all shadow-md active:scale-[0.98]"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Logout Confirmation */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar tu sesión?"
        confirmText="Cerrar Sesión"
        variant="danger"
      />

      {/* Clear Cache Confirmation */}
      <ConfirmDialog
        isOpen={showClearCacheConfirm}
        onClose={() => setShowClearCacheConfirm(false)}
        onConfirm={handleClearCache}
        title="Limpiar Caché"
        message="Se eliminarán los datos almacenados localmente. Tus tareas y cuenta no se verán afectadas."
        confirmText="Limpiar"
        variant="warning"
      />
    </div>
  );
}

export default SettingsPage;
