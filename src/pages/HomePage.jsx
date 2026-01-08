import React from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import SectionHeader from '../components/SectionHeader';
import TaskCard from '../components/TaskCard';
import TasksCompleted from '../components/TasksCompleted';
import AddButton from '../components/AddButton';
import TaskModal from '../components/TaskModal';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import useLocalStorage from '../hooks/useLocalStorage';

/**
 * HomePage Component
 * Página principal con la lista de tareas del día
 */
function HomePage() {
  // Tareas por defecto si no hay nada en localStorage
  const defaultTodos = [
    { id: Date.now() + 1, text: 'Workout for 40min', timeRange: '8:00AM - 8:30AM', completed: false, color: '#8b5cf6' },
    { id: Date.now() + 2, text: 'Design the home screen of the music app', timeRange: '11:00AM - 12:00PM', completed: false, color: '#ec4899' },
    { id: Date.now() + 3, text: 'Learn React.js', timeRange: '1:00PM - 2:00PM', completed: true, color: '#06b6d4' },
  ];

  // Usar el hook personalizado para persistencia en localStorage
  const [todos, setTodos] = useLocalStorage('todos', defaultTodos);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState({ isOpen: false, taskIndex: null });

  const completedTodos = todos.filter(todo => !!todo.completed).length;
  const totalTodos = todos.length;
  const progressPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const filteredTodos = todos.filter(todo => 
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleTodo = (index, completed) => {
    const newTodos = [...todos];
    newTodos[index].completed = completed;
    setTodos(newTodos);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task) => {
    if (editingTask !== null) {
      // Editar tarea existente
      const newTodos = [...todos];
      newTodos[editingTask] = { ...newTodos[editingTask], ...task };
      setTodos(newTodos);
    } else {
      // Agregar nueva tarea con ID único
      const newTask = {
        ...task,
        id: Date.now(), // ID único basado en timestamp
      };
      setTodos([...todos, newTask]);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (index) => {
    setEditingTask(index);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (index) => {
    setDeleteConfirm({ isOpen: true, taskIndex: index });
  };

  const confirmDelete = () => {
    if (deleteConfirm.taskIndex !== null) {
      const newTodos = todos.filter((_, i) => i !== deleteConfirm.taskIndex);
      setTodos(newTodos);
      setDeleteConfirm({ isOpen: false, taskIndex: null });
    }
  };

  return (
    <>
      {/* Header */}
      <Header userName="Nicolás" date="19 october 2025" time="5:00pm" />
      
      {/* Search Bar */}
      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        placeholder="Search your Lists"
      />
      
      {/* Section Header with Progress */}
      <SectionHeader 
        title="Today's tasks" 
        progress={progressPercentage}
        showProgress={true}
      />
      
      {/* Tasks List */}
      <div className="px-6 mb-6">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo, index) => (
            <TaskCard
              key={todo.id || index}
              title={todo.text}
              timeRange={todo.timeRange}
              completed={todo.completed}
              accentColor={todo.color}
              onToggle={(completed) => handleToggleTodo(index, completed)}
              onEdit={() => handleEditTask(index)}
              onDelete={() => handleDeleteTask(index)}
            />
          ))
        ) : (
          <EmptyState 
            message={searchTerm ? "No tasks match your search" : "No tasks yet. Create one to get started!"}
          />
        )}
      </div>
      
      {/* Tasks Completed Counter */}
      {totalTodos > 0 && (
        <TasksCompleted 
          completedTodos={completedTodos} 
          totalTodos={totalTodos} 
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
        initialTask={editingTask !== null ? todos[editingTask] : null}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, taskIndex: null })}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </>
  );
}

export default HomePage;
