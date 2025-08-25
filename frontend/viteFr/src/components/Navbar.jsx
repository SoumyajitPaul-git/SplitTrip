import { Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  // const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/dashboard" className="font-bold text-xl">
        SplitTrip
      </Link>
      <div className="space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/create-tour">Create Tour</Link>
        <button
          // onClick={logout}
          className="bg-white text-blue-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
