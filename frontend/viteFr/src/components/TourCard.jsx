import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const TourCard = ({ tour }) => {
  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    switch (status) {
      case "planning":
        return "bg-yellow-100 text-yellow-700";
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div
      onClick={() => navigate(`/tour/${tour._id}`)}
      className="cursor-pointer border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition duration-300 bg-white"
    >
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {tour.name}
          </h3>
          <p className="text-sm text-gray-500">{tour.destination}</p>
        </div>

        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
            tour.status,
          )}`}
        >
          {tour.status}
        </span>
      </div>

      {/* Description */}
      {tour.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {tour.description}
        </p>
      )}

      {/* Divider */}
      <div className="border-t border-gray-100 my-4"></div>

      {/* Info */}
      <div className="space-y-2 text-sm text-gray-600">
        <div>
          <span className="font-medium text-gray-900">
            {format(new Date(tour.startDate), "MMM dd, yyyy")} -{" "}
            {format(new Date(tour.endDate), "MMM dd, yyyy")}
          </span>
        </div>

        <div>{tour.members?.length || 0} members</div>

        <div>Captain: {tour.captain?.name}</div>

        <div>
          <span className="text-xs text-gray-500">Join code</span>
          <div className="mt-1 inline-block px-3 py-1 rounded-lg bg-gray-100 font-mono text-xs">
            {tour.joinCode}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
