import React from 'react';

/**
 * CalendarPage Component
 * Página de calendario para visualización de tareas por fecha
 */
function CalendarPage() {
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Calendar</h1>
        <p className="text-secondary">{currentMonth}</p>
      </div>

      <div className="bg-card rounded-xl p-6 border border-theme shadow-sm mb-6">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-secondary text-sm font-semibold">
              {day}
            </div>
          ))}
        </div>

        {/* Grid de días del mes */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 2; // Ajuste para empezar el mes correctamente
            const isToday = day === today.getDate();
            const isCurrentMonth = day > 0 && day <= 31;

            return (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                  isToday
                    ? 'bg-accent text-white font-bold shadow-md'
                    : isCurrentMonth
                    ? 'text-primary hover:bg-hover cursor-pointer'
                    : 'text-tertiary'
                }`}
              >
                {isCurrentMonth ? day : ''}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-xl p-4 border border-theme shadow-sm">
        <h2 className="text-primary font-semibold mb-3">Upcoming Events</h2>
        <p className="text-secondary text-center py-8">No events scheduled</p>
      </div>
    </div>
  );
}

export default CalendarPage;
