import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Header Component
 * Muestra el saludo dinámico, fecha/hora actual y avatar del usuario autenticado
 */
function Header() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const userName = user?.name?.split(' ')[0] || 'Usuario';
  const avatarUrl = user?.avatarUrl || user?.avatar_url;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formattedDate = currentTime.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getInitials = () => {
    if (!user?.name) return '?';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex items-center justify-between px-6 pt-8 pb-6">
      <div>
        <h1 className="text-primary text-2xl font-semibold">{getGreeting()}, {userName}</h1>
        <p className="text-secondary text-sm mt-1">{formattedDate} · {formattedTime}</p>
      </div>
      <div className="w-12 h-12 rounded-full overflow-hidden bg-accent flex items-center justify-center shadow-md">
        {avatarUrl ? (
          <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-sm font-bold">{getInitials()}</span>
        )}
      </div>
    </div>
  );
}

export default Header;
