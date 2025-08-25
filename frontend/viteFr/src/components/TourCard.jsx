import { Link } from "react-router-dom";

export default function TourCard({ tour }) {
  return (
    <div className="bg-white shadow rounded p-4 border">
      <h3 className="text-lg font-bold">{tour.name}</h3>
      <p>{tour.location}</p>
      <p className="text-sm text-gray-500">
        {new Date(tour.startDate).toLocaleDateString()} -{" "}
        {new Date(tour.endDate).toLocaleDateString()}
      </p>
      <Link
        to={`/tour/${tour._id}`}
        className="inline-block mt-2 text-blue-600 hover:underline"
      >
        View Details →
      </Link>
    </div>
  );
}
