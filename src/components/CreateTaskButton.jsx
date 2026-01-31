/**
 * CreateTaskButton Component
 * Botón para crear nuevas tareas
 * Soporta colores de acento dinámicos
 */
function CreateTaskButton({ onClick, children = "Create Task" }) {
  return (
    <button 
      onClick={onClick}
      className="btn-accent px-6 py-3 rounded-lg font-semibold"
    >
      <span>{children}</span>
    </button>
  );
}

export default CreateTaskButton;