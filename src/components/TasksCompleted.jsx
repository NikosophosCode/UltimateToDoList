/**
 * TasksCompleted Component
 * Muestra el contador de tareas completadas de forma minimalista
 * Integrado coherentemente con el diseño general
 */
function TasksCompleted({ completedTodos, totalTodos }) {
  const percentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  
  return (
    <div className="px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent"></div>
        <span className="text-secondary text-sm">
          {completedTodos} of {totalTodos} tasks completed
        </span>
      </div>
      <span className="text-accent text-sm font-semibold">
        {percentage}%
      </span>
    </div>
  );
}

export default TasksCompleted;
