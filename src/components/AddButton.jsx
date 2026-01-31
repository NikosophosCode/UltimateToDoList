/**
 * AddButton Component
 * Botón flotante circular para agregar nuevas tareas
 * Soporta colores de acento dinámicos
 */
function AddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn-fab"
      aria-label="Add new task"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}

export default AddButton;
