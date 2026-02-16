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

      <div className="bg-white">
        <div className="max-w-2xl mx-auto px-6 py-14">
          <h1 className="text-4xl font-semibold text-gray-900 mb-10">
            Create a new trip
          </h1>

          <div className="border border-gray-200 rounded-3xl p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tour Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Goa Trip 2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add details about your trip..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none resize-none"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination *
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Goa, India"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-2.5 rounded-full border border-gray-300 hover:bg-gray-100 transition text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition text-sm font-medium disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );

};

export default CreateTourPage;
