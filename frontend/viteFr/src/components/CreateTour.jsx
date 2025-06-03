import { useState } from "react";

export default function CreateTour({ onCreate }) {
  const [tour, setTour] = useState({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleChange = (e) => {
    setTour({ ...tour, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onCreate) onCreate(tour);
    setTour({
      name: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-lg shadow space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Tour Name"
          value={tour.name}
          onChange={handleChange}
          className="bg-gray-700 text-white p-2 rounded w-full"
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={tour.location}
          onChange={handleChange}
          className="bg-gray-700 text-white p-2 rounded w-full"
          required
        />
        <input
          name="startDate"
          type="date"
          value={tour.startDate}
          onChange={handleChange}
          className="bg-gray-700 text-white p-2 rounded w-full"
          required
        />
        <input
          name="endDate"
          type="date"
          value={tour.endDate}
          onChange={handleChange}
          className="bg-gray-700 text-white p-2 rounded w-full"
          required
        />
      </div>
      <textarea
        name="description"
        placeholder="Description"
        value={tour.description}
        onChange={handleChange}
        className="bg-gray-700 text-white p-2 rounded w-full"
        rows={3}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
      >
        Create Tour
      </button>
    </form>
  );
}
