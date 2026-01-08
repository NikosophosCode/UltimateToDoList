/**
 * Header Component
 * Muestra el saludo personalizado del usuario con la fecha, hora y avatar
 */
function Header({ userName = "Nicolás", date = "19 october 2025", time = "5:00pm" }) {
  return (
    <div className="flex items-center justify-between px-6 pt-8 pb-6">
      <div>
        <h1 className="text-primary text-2xl font-semibold">Hey, {userName}</h1>
        <p className="text-secondary text-sm mt-1">{date} {time}</p>
      </div>
      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-md">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

export default Header;
