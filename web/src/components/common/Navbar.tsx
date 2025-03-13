import { NavLink } from "react-router";
import { useAuthStore } from "../../store";
import { Calendar, HomeIcon, LogIn, LogInIcon, UserIcon } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-slate-600 p-4 flex px-8 items-center justify-between">
      {user && (
        <NavLink
          to="/profile"
          className="text-white flex items-center space-x-2"
        >
          <UserIcon size={22} />
          <div className="flex items-center space-x-2">{user?.name}</div>
        </NavLink>
      )}

      {/* Navigation Links with icons */}
      <div className="flex items-center space-x-6">
        <NavLink to="/concerts" className="text-white">
          <HomeIcon size={24} />
        </NavLink>
        <NavLink to="/events" className="text-white">
          <Calendar size={24} />
        </NavLink>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <button
              onClick={logout}
              className="bg-red-800 text-white flex cursor-pointer items-center gap-x-2 px-3 py-1 text-sm rounded-md transition-colors duration-200"
            >
              <span>
                <LogInIcon size={18} />
              </span>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login">
            <button className="bg-blue-800 text-white cursor-pointer flex items-center gap-x-2 px-3 py-1 text-sm rounded-md transition-colors duration-200">
              <span>
                <LogIn size={18} />
              </span>
              Login
            </button>
          </NavLink>
        )}
      </div>
    </nav>
  );
};
