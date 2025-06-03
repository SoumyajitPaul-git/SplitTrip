// src/components/Dashboard.jsx
import { useNavigate } from "react-router-dom";

export default function Dashboard({ tourId = "", payments = [] }) {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-400">
          {tourId ? `Tour ID: ${tourId}` : "Tour Dashboard"}
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Home
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Payment History</h3>
        {payments.length === 0 ? (
          <p className="text-gray-400">No payments recorded yet.</p>
        ) : (
          <ul className="space-y-3">
            {payments.map((payment, index) => (
              <li
                key={index}
                className="p-4 bg-gray-700 rounded-lg shadow-sm border border-gray-600"
              >
                <p className="text-lg font-medium text-white">
                  💸 <span className="text-blue-300">{payment.paidBy}</span>{" "}
                  paid ₹{payment.amount}
                </p>
                <p className="text-sm text-gray-300">{payment.purpose}</p>
                <p className="text-sm text-gray-300">
                  Split with:{" "}
                  <span className="text-green-300">
                    {payment.splitWith.join(", ")}
                  </span>
                </p>
                <p className="text-xs text-gray-400">{payment.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
