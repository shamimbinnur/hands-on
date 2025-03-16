import { NavLink } from "react-router";
import { useAuthStore } from "../../store";
import { Calendar, Home, LogIn, LogOut, User } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuthStore();

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
      isActive
        ? "bg-slate-700 text-white font-medium"
        : "text-slate-200 hover:bg-slate-700/50"
    }`;

  return (
    <nav className="bg-slate-800 shadow-md" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-white font-bold text-xl">Hands-on</span>
          </div>

          {/* Center Navigation Links */}
          <div className="flex items-center space-x-4">
            <NavLink to="/concerts" className={getLinkClass} title="Concerts">
              <Home size={20} />
              <span className="hidden sm:inline">Concerts</span>
            </NavLink>

            <NavLink to="/event" className={getLinkClass} title="Events">
              <Calendar size={20} />
              <span className="hidden sm:inline">Events</span>
            </NavLink>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/profile"
                  className={getLinkClass}
                  title="Your Profile"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">{user.name}</span>
                </NavLink>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <NavLink to="/login">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                  aria-label="Login"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
