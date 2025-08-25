import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function FinalReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/tours/${id}/report`, {
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then(setReport);
  }, [id]);

  return (
    <>
      {/* <Navbar /> */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Final Report</h1>
        {report ? (
          <div className="space-y-3">
            <p>Total Budget: ₹{report.total}</p>
            <h2 className="text-lg font-semibold">Settlements:</h2>
            {report.settlements.map((entry, i) => (
              <p key={i}>
                {entry.from} → {entry.to}: ₹{entry.amount}
              </p>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}
