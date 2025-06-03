import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6 text-lg text-gray-300">
        The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
