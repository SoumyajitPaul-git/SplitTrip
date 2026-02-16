import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseForm from "../components/ExpenseForm";

const TourDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tour, setTour] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");

  useEffect(() => {
    fetchTourDetails();
    fetchExpenses();
  }, [id]);

  const fetchTourDetails = async () => {
    try {
      const response = await api.get(`/tours/${id}`);
      setTour(response.data.tour);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tour details");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await api.get(`/expenses/tour/${id}`);
      setExpenses(response.data.expenses);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      await api.post("/expenses", {
        ...expenseData,
        tour: id,
      });
      setShowExpenseModal(false);
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add expense");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await api.delete(`/expenses/${expenseId}`);
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete expense");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.patch(`/tours/${id}/status`, { status: newStatus });
      fetchTourDetails();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const copyJoinCode = () => {
    navigator.clipboard.writeText(tour.joinCode);
    alert("Join code copied to clipboard!");
  };

  const getStatusBadge = (status) => {
    const badges = {
      planning: "badge-warning",
      active: "badge-success",
      completed: "badge-primary",
    };
    return badges[status] || "badge-primary";
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const isCaptain = tour?.captain._id === user?.id;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-rose-500 rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  if (error || !tour) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            {error || "Tour not found"}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </>
    );
  }

return (
  <>
    <Navbar />

    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{tour.name}</h1>
            <p className="text-gray-500 text-lg">📍 {tour.destination}</p>
          </div>

          <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-rose-100 text-rose-600 capitalize">
            {tour.status}
          </span>
        </div>

        {tour.description && (
          <p className="text-gray-600">{tour.description}</p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-xl text-sm">
          <div>
            <p className="text-gray-400 mb-1">Duration</p>
            <p className="font-semibold">
              {format(new Date(tour.startDate), "MMM dd")} –{" "}
              {format(new Date(tour.endDate), "MMM dd, yyyy")}
            </p>
          </div>

          <div>
            <p className="text-gray-400 mb-1">Captain</p>
            <p className="font-semibold">{tour.captain.name}</p>
          </div>

          <div>
            <p className="text-gray-400 mb-1">Members</p>
            <p className="font-semibold">{tour.members.length} people</p>
          </div>

          <div>
            <p className="text-gray-400 mb-1">Total</p>
            <p className="font-semibold text-rose-600">
              ₹{totalExpenses.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Join Code */}
        <div className="flex items-center justify-between bg-rose-500 text-white p-6 rounded-xl">
          <div>
            <p className="text-sm opacity-80 mb-1">Join Code</p>
            <p className="text-2xl font-bold font-mono">{tour.joinCode}</p>
          </div>

          <button
            onClick={copyJoinCode}
            className="bg-white text-rose-600 px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Copy
          </button>
        </div>

        {/* Captain Actions */}
        {isCaptain && (
          <div className="flex gap-3">
            {tour.status === "planning" && (
              <button
                onClick={() => handleUpdateStatus("active")}
                className="px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                Start Tour
              </button>
            )}

            {tour.status === "active" && (
              <button
                onClick={() => handleUpdateStatus("completed")}
                className="px-5 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
              >
                Complete Tour
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b flex gap-8 text-sm font-medium">
        <button
          onClick={() => setActiveTab("expenses")}
          className={`pb-3 ${
            activeTab === "expenses"
              ? "border-b-2 border-rose-500 text-rose-600"
              : "text-gray-500"
          }`}
        >
          Expenses ({expenses.length})
        </button>

        <button
          onClick={() => setActiveTab("members")}
          className={`pb-3 ${
            activeTab === "members"
              ? "border-b-2 border-rose-500 text-rose-600"
              : "text-gray-500"
          }`}
        >
          Members ({tour.members.length})
        </button>
      </div>

      {/* Expenses Tab */}
      {activeTab === "expenses" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Expenses</h2>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/tour/${id}/report`)}
                className="px-5 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                View Report
              </button>

              <button
                onClick={() => setShowExpenseModal(true)}
                className="px-5 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
              >
                + Add Expense
              </button>
            </div>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
              <p className="text-gray-500">
                Start adding expenses to track your tour spending.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {expenses.map((expense) => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  onDelete={handleDeleteExpense}
                  canDelete={expense.createdBy._id === user.id || isCaptain}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Members Tab */
        <div className="grid md:grid-cols-2 gap-6">
          {tour.members.map((member) => (
            <div
              key={member.user._id}
              className="bg-white border rounded-xl p-6 flex items-center gap-5 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center font-semibold text-lg">
                {member.user.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="font-semibold flex items-center gap-2">
                  {member.user.name}
                  {member.user._id === tour.captain._id && (
                    <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                      Captain
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500">{member.user.email}</p>

                <p className="text-xs text-gray-400 mt-1">
                  Joined {format(new Date(member.joinedAt), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showExpenseModal && (
        <div
          onClick={() => setShowExpenseModal(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add New Expense</h2>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <ExpenseForm
              members={tour.members}
              onSubmit={handleAddExpense}
              onCancel={() => setShowExpenseModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  </>
);

};

export default TourDetailsPage;
