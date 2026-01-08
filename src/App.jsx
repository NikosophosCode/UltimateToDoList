import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

/**
 * App Component
 * Componente principal que gestiona el routing de la aplicación
 */
function App() {
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
      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

export default App;
