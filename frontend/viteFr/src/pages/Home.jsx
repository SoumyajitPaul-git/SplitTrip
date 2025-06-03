import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
        Welcome to <span className="text-blue-500">SplitTrip</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-xl text-center mb-8">
        Effortlessly split bills and track group expenses during your trips.
        Fair, fast, and transparent.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
