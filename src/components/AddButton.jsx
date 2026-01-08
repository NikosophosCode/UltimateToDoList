/**
 * AddButton Component
 * Botón flotante circular para agregar nuevas tareas
 */
function AddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
      aria-label="Add new task"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}

export default AddButton;
