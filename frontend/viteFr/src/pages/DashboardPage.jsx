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
      <div className="container pt-8 pb-8">
        <div className="page-header">
          <h1 className="page-title">My Tours</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowJoinModal(true)}
              className="btn btn-outline"
            >
              Join Tour
            </button>
            <button
              onClick={() => navigate("/create-tour")}
              className="btn btn-primary"
            >
              + Create New Tour
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : tours.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🧳</div>
            <h2 className="empty-state-title">No tours yet</h2>
            <p>Create a new tour or join an existing one to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        )}

        {showJoinModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowJoinModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Join a Tour</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowJoinModal(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleJoinTour}>
                <div className="modal-body">
                  {joinError && (
                    <div className="alert alert-error">{joinError}</div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Tour Join Code</label>
                    <input
                      type="text"
                      className="form-control font-mono text-base"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Enter 8-character code"
                      required
                    />
                    <small className="text-gray-600 text-[0.8125rem]">
                      Ask the tour captain for the join code
                    </small>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={joining}
                  >
                    {joining ? "Joining..." : "Join Tour"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
