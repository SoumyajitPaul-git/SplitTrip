import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const CreateTourPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    destination: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError("End date must be after start date");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/tours", formData);
      navigate(`/tour/${response.data.tour._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container pt-8 pb-8 max-w-2xl">
        <h1 className="page-title mb-8">Create New Tour</h1>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tour Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Goa Trip 2024"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add details about your tour..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Destination *</label>
              <input
                type="text"
                name="destination"
                className="form-control"
                value={formData.destination}
                onChange={handleChange}
                required
                placeholder="e.g., Goa, India"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-8">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Tour"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTourPage;
