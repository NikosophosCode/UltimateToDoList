import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import SectionHeader from '../components/SectionHeader';
import TaskCard from '../components/TaskCard';
import TasksCompleted from '../components/TasksCompleted';
import AddButton from '../components/AddButton';
import TaskModal from '../components/TaskModal';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { LoadingSpinner } from '../components/common';
import { useTasks } from '../hooks/useTasks';

/**
 * HomePage Component
 * Página principal con la lista de tareas del día
 * Conectada al backend API para persistencia
 */
function HomePage() {
  const { tasks, isLoading, stats, createTask, updateTask, deleteTask, toggleTask, migrateFromLocalStorage } = useTasks({ todayOnly: true });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, task: null });
  const [hasMigrated, setHasMigrated] = useState(false);

  // Migrar tareas de localStorage al backend (una sola vez)
  useEffect(() => {
    if (hasMigrated) return;
    const localTasks = localStorage.getItem('todos');
    if (localTasks) {
      try {
        const parsed = JSON.parse(localTasks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          migrateFromLocalStorage();
          setHasMigrated(true);
        }
      } catch {
        // Ignorar errores de parsing
      }
    }
  }, [hasMigrated, migrateFromLocalStorage]);

  const filteredTasks = tasks.filter(task => 
    (task.title || task.text || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleTodo = useCallback((taskId, completed) => {
    toggleTask(taskId, completed);
  }, [toggleTask]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      // Si no tiene fecha, asignar hoy para que aparezca en la vista
      if (!taskData.dueDate) {
        taskData.dueDate = new Date().toISOString().split('T')[0];
      }
      await createTask(taskData);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setDeleteConfirm({ isOpen: true, task });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.task) {
      await deleteTask(deleteConfirm.task.id);
      setDeleteConfirm({ isOpen: false, task: null });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" message="Cargando tareas..." />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <Header />
      
      {/* Search Bar */}
      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        placeholder="Buscar en tus listas"
      />
      
      {/* Section Header with Progress */}
      <SectionHeader 
        title="Tareas de hoy" 
        progress={stats.percentage}
        showProgress={true}
      />
      
      {/* Tasks List */}
      <div className="px-6 mb-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title || task.text}
              timeRange={task.timeRange}
              completed={task.completed}
              accentColor={task.color}
              onToggle={(completed) => handleToggleTodo(task.id, completed)}
              onEdit={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task)}
            />
          ))
        ) : (
          <EmptyState 
            message={searchTerm ? "No se encontraron tareas" : "No tienes tareas para hoy. ¡Crea una!"}
          />
        )}
      </div>
      
      {/* Tasks Completed Counter */}
      {stats.total > 0 && (
        <TasksCompleted 
          completedTodos={stats.completed} 
          totalTodos={stats.total} 
        />
      )}
      
      {/* Add Button */}
      <AddButton onClick={handleAddTask} />

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, task: null })}
        onConfirm={confirmDelete}
        title="¿Eliminar tarea?"
        message="Esta acción no se puede deshacer. La tarea será eliminada permanentemente."
      />
    </>
  );
}

export default HomePage;
