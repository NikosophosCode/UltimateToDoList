/**
 * EmptyState Component
 * Muestra un mensaje cuando no hay tareas o cuando la búsqueda no tiene resultados
 */
function EmptyState({ message = "No tasks found", showIcon = true }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      {showIcon && (
        <div className="w-20 h-20 rounded-full bg-[#3d2852] flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      )}
      <p className="text-gray-400 text-center">{message}</p>
    </div>
  );
}

export default EmptyState;
