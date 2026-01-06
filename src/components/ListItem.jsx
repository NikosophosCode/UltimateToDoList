function ListItem({ task }) {
  return (
    <p className="text-5xl hover:bg-gray-100 p-2 rounded border border-gray-200">
      {task}
    </p>
  )
}
export default ListItem;