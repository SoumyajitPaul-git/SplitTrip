import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-400">SplitTrip</div>
        <div className="space-x-6 text-lg">
          <Link
            to="/"
            className={`hover:text-blue-400 ${
              location.pathname === "/" ? "text-blue-400" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/profile"
            className={`hover:text-blue-400 ${
              location.pathname === "/profile" ? "text-blue-400" : ""
            }`}
          >
            Profile
          </Link>
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="text-red-400 hover:text-red-500"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-green-400">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
