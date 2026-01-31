import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Components
import BottomNavigation from './components/BottomNavigation';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

// Pages - Main App
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

// Pages - Auth
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages/auth';

// Routes config
import { ROUTES } from './config/constants';

/**
 * MainLayout Component
 * Layout principal de la aplicación con navegación inferior
 */
function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar el tab activo basado en la ruta actual
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/profile') return 'profile';
    if (path === '/calendar') return 'calendar';
    if (path === '/analytics') return 'analytics';
    if (path === '/settings') return 'settings';
    return 'home';
  };

  const handleTabChange = (tab) => {
    const routes = {
      home: '/',
      profile: '/profile',
      calendar: '/calendar',
      analytics: '/analytics',
      settings: '/settings',
    };
    navigate(routes[tab]);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen pb-20 relative">
      {children}
      <BottomNavigation 
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

/**
 * App Component
 * Componente principal que gestiona el routing de la aplicación
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Toast notifications */}
        <Toaster 
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />

        <Routes>
          {/* Rutas públicas (solo para usuarios no autenticados) */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.RESET_PASSWORD}
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas (requieren autenticación) */}
          <Route
            path={ROUTES.HOME}
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HomePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CALENDAR}
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CalendarPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ANALYTICS}
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AnalyticsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SETTINGS}
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Ruta por defecto - redirigir al home */}
          <Route path="*" element={<PublicRoute><LoginPage /></PublicRoute>} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
