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
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold text-primary no-underline">
          🧳 SplitTrip
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="no-underline text-gray-700 font-medium hover:text-primary transition-colors"
            >
              Dashboard
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">{user.name}</span>
              <button onClick={handleLogout} className="btn btn-sm btn-outline">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
