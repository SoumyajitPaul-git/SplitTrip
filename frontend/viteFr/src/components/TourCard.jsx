import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const TourCard = ({ tour }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const badges = {
      planning: "badge-warning",
      active: "badge-success",
      completed: "badge-primary",
    };
    return badges[status] || "badge-primary";
  };

  return (
    <div className="tour-card" onClick={() => navigate(`/tour/${tour._id}`)}>
      <div className="tour-card-header">
        <div>
          <h3 className="tour-card-title">{tour.name}</h3>
          <p className="tour-card-destination">📍 {tour.destination}</p>
        </div>
        <span className={`badge ${getStatusBadge(tour.status)}`}>
          {tour.status}
        </span>
      </div>

      {tour.description && (
        <p className="text-gray-600 text-sm mb-4">{tour.description}</p>
      )}

      <div className="tour-card-info">
        <div className="tour-card-info-item">
          <span>📅</span>
          <span>
            {format(new Date(tour.startDate), "MMM dd, yyyy")} -{" "}
            {format(new Date(tour.endDate), "MMM dd, yyyy")}
          </span>
        </div>

        <div className="tour-card-info-item">
          <span>👥</span>
          <span>{tour.members?.length || 0} members</span>
        </div>

        <div className="tour-card-info-item">
          <span>👤</span>
          <span>Captain: {tour.captain?.name}</span>
        </div>

        <div className="tour-card-info-item">
          <span>🔑</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-[0.8125rem]">
            Join Code: {tour.joinCode}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
