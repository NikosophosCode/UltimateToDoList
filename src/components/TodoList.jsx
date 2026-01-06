import ListItem from "./ListItem";

function TodoList({ todos, searchTerm, defaultTodos }) {
  const filteredTodos = todos.length > 0 ? todos : defaultTodos;

  return (
    <ul className="flex flex-col gap-2 list-none p-0 m-0">
      {filteredTodos
        .filter(todo => todo.text.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((todo, index) => (
          <li key={index} className="flex items-center gap-2">
            <ListItem task={todo.text} />
            <input type="checkbox" checked={todo.completed} readOnly />
          </li>
        ))}
    </ul>
  )
}
export default TodoList;