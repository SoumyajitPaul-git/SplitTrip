import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import TourCard from "../components/TourCard";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tours");
      setTours(response.data.tours);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tours");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTour = async (e) => {
    e.preventDefault();
    setJoinError("");
    setJoining(true);

    try {
      await api.post(`/tours/join/${joinCode.trim()}`);
      setShowJoinModal(false);
      setJoinCode("");
      fetchTours();
    } catch (err) {
      setJoinError(err.response?.data?.message || "Failed to join tour");
    } finally {
      setJoining(false);
    }
  };

return (
  <>
    <Navbar />

    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900">Your Trips</h1>
            <p className="text-gray-500 mt-2">
              Manage and track your shared travel expenses
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-6 py-2.5 text-sm font-medium rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition"
            >
              Join trip
            </button>

            <button
              onClick={() => navigate("/create-tour")}
              className="px-6 py-2.5 text-sm font-medium rounded-full bg-rose-500 text-white hover:bg-rose-600 transition shadow-sm"
            >
              + Create trip
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-rose-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        ) : tours.length === 0 ? (
          <div className="border border-gray-200 rounded-3xl p-20 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No trips yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create a new trip or join an existing one to get started.
            </p>
            <button
              onClick={() => navigate("/create-tour")}
              className="px-8 py-3 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition"
            >
              Create your first trip
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Join Modal */}
    {showJoinModal && (
      <div
        className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4"
        onClick={() => setShowJoinModal(false)}
      >
        <div
          className="bg-white w-full max-w-md rounded-3xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Join a Trip</h2>
          </div>

          <form onSubmit={handleJoinTour}>
            <div className="px-8 py-8 space-y-5">
              {joinError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
                  {joinError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter join code"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-8 py-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="px-5 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={joining}
                className="px-6 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition text-sm disabled:opacity-50"
              >
                {joining ? "Joining..." : "Join trip"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>
);

};

export default DashboardPage;
