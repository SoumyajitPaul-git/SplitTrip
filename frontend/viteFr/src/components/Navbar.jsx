import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-semibold tracking-tight text-rose-500"
          >
            SplitTrip
          </Link>

          {user && (
            <div className="flex items-center gap-8">
              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-rose-500 transition-colors"
                >
                  Home
                </Link>

                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-rose-500 transition-colors"
                >
                  Dashboard
                </Link>
              </div>

              {/* User Section */}
              <div className="flex items-center gap-4">
                <span className="text-gray-500 text-sm hidden sm:block">
                  {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-sm font-medium rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
