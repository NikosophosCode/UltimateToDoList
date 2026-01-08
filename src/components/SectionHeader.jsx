/**
 * SectionHeader Component
 * Encabezado de sección con título e indicador de progreso
 */
function SectionHeader({ title = "Today's tasks", progress = 0, showProgress = true }) {
  return (
    <div className="flex items-center justify-between px-6 mb-4">
      <h2 className="text-primary text-xl font-semibold">{title}</h2>
      {showProgress && (
        <div className="relative w-12 h-12">
          {/* Círculo de progreso */}
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
            {/* Fondo del círculo */}
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="var(--border-color)"
              strokeWidth="3"
              fill="none"
            />
            {/* Progreso */}
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="var(--accent-from)"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${progress * 1.256} 125.6`}
              strokeLinecap="round"
            />
          </svg>
          {/* Texto del porcentaje */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-primary text-xs font-semibold">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SectionHeader;
