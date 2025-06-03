// src/components/JoinTour.jsx


import { useState } from "react";

export default function JoinTour({ onJoin }) {
  const [tourId, setTourId] = useState("");

  const handleJoinTour = () => {
    if (tourId.trim()) onJoin(tourId.trim());
  };

  return (
    <div className="flex gap-4 items-center">
      <input
        type="text"
        value={tourId}
        onChange={(e) => setTourId(e.target.value)}
        placeholder="Enter Tour ID"
        className="p-2 border rounded"
      />
      <button
        onClick={handleJoinTour}
        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
      >
        Join Tour
      </button>
    </div>
  );
}

