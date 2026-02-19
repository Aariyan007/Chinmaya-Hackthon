import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg p-6 hidden md:block">
      <h2 className="text-2xl font-extrabold text-blue-600 mb-10">
        CivicAI
      </h2>

      <nav className="space-y-4">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`
          }
        >
          📄 My Reports
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`
          }
        >
          👤 Profile
        </NavLink>

      </nav>
    </div>
  );
}
