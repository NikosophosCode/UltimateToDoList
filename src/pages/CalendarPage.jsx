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
        <h1 className="text-2xl font-bold text-white mb-2">Calendar</h1>
        <p className="text-gray-400">{currentMonth}</p>
      </div>

      <div className="bg-[#2d1b3d] rounded-xl p-6 border border-gray-700 mb-6">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-gray-400 text-sm font-semibold">
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
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold'
                    : isCurrentMonth
                    ? 'text-gray-300 hover:bg-gray-700 cursor-pointer'
                    : 'text-gray-600'
                }`}
              >
                {isCurrentMonth ? day : ''}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#2d1b3d] rounded-xl p-4 border border-gray-700">
        <h2 className="text-white font-semibold mb-3">Upcoming Events</h2>
        <p className="text-gray-400 text-center py-8">No events scheduled</p>
      </div>
    </div>
  );
}

export default CalendarPage;
