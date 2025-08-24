import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CreateTourPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/tours/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.tour) navigate("/dashboard");
    else alert(data.message);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4">Create New Tour</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Tour Name"
            className="w-full mb-2 p-2 border"
            onChange={handleChange}
          />
          <input
            name="location"
            placeholder="Location"
            className="w-full mb-2 p-2 border"
            onChange={handleChange}
          />
          <input
            name="startDate"
            type="date"
            className="w-full mb-2 p-2 border"
            onChange={handleChange}
          />
          <input
            name="endDate"
            type="date"
            className="w-full mb-2 p-2 border"
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            className="w-full mb-4 p-2 border"
            onChange={handleChange}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Tour
          </button>
        </form>
      </div>
    </>
  );
}
