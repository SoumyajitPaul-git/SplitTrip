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
        <div className="spinner"></div>
      </>
    );
  }

  if (error || !tour) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: "2rem" }}>
          <div className="alert alert-error">{error || "Tour not found"}</div>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
      >
        {/* Tour Header */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                {tour.name}
              </h1>
              <p style={{ color: "var(--gray-600)", fontSize: "1.125rem" }}>
                📍 {tour.destination}
              </p>
            </div>
            <span
              className={`badge ${getStatusBadge(tour.status)}`}
              style={{ fontSize: "0.875rem" }}
            >
              {tour.status}
            </span>
          </div>

          {tour.description && (
            <p style={{ color: "var(--gray-600)", marginBottom: "1rem" }}>
              {tour.description}
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              padding: "1rem",
              backgroundColor: "var(--gray-50)",
              borderRadius: "var(--border-radius)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--gray-600)",
                  marginBottom: "0.25rem",
                }}
              >
                Duration
              </div>
              <div style={{ fontWeight: 600 }}>
                {format(new Date(tour.startDate), "MMM dd")} -{" "}
                {format(new Date(tour.endDate), "MMM dd, yyyy")}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--gray-600)",
                  marginBottom: "0.25rem",
                }}
              >
                Captain
              </div>
              <div style={{ fontWeight: 600 }}>{tour.captain.name}</div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--gray-600)",
                  marginBottom: "0.25rem",
                }}
              >
                Members
              </div>
              <div style={{ fontWeight: 600 }}>
                {tour.members.length} people
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--gray-600)",
                  marginBottom: "0.25rem",
                }}
              >
                Total Expenses
              </div>
              <div style={{ fontWeight: 600, color: "var(--primary)" }}>
                ₹{totalExpenses.toFixed(2)}
              </div>
            </div>

            <div className="">
              Joining Code
              <div style={{ fontWeight: 600, color: "var(--primary)" }}>
                {tour.joinCode}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "var(--primary)",
              color: "white",
              borderRadius: "var(--border-radius)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  opacity: 0.9,
                  marginBottom: "0.25rem",
                }}
              >
                Join Code
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {tour.joinCode}
              </div>
            </div>
            <button
              onClick={copyJoinCode}
              className="btn"
              style={{ backgroundColor: "white", color: "var(--primary)" }}
            >
              Copy Code
            </button>
          </div>

          {isCaptain && (
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              {tour.status === "planning" && (
                <button
                  onClick={() => handleUpdateStatus("active")}
                  className="btn btn-secondary btn-sm"
                >
                  Start Tour
                </button>
              )}
              {tour.status === "active" && (
                <button
                  onClick={() => handleUpdateStatus("completed")}
                  className="btn btn-primary btn-sm"
                >
                  Complete Tour
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            borderBottom: "2px solid var(--gray-200)",
            marginBottom: "1.5rem",
          }}
        >
          <button
            onClick={() => setActiveTab("expenses")}
            style={{
              padding: "0.75rem 1.5rem",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "expenses" ? "2px solid var(--primary)" : "none",
              color:
                activeTab === "expenses" ? "var(--primary)" : "var(--gray-600)",
              fontWeight: activeTab === "expenses" ? 600 : 400,
              cursor: "pointer",
              marginBottom: "-2px",
            }}
          >
            Expenses ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab("members")}
            style={{
              padding: "0.75rem 1.5rem",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "members" ? "2px solid var(--primary)" : "none",
              color:
                activeTab === "members" ? "var(--primary)" : "var(--gray-600)",
              fontWeight: activeTab === "members" ? 600 : 400,
              cursor: "pointer",
              marginBottom: "-2px",
            }}
          >
            Members ({tour.members.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "expenses" ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Expenses</h2>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => navigate(`/tour/${id}/report`)}
                  className="btn btn-outline"
                >
                  View Report
                </button>
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="btn btn-primary"
                >
                  + Add Expense
                </button>
              </div>
            </div>

            {expenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">💰</div>
                <h3 className="empty-state-title">No expenses yet</h3>
                <p>Start adding expenses to track your tour spending</p>
              </div>
            ) : (
              <div className="grid grid-cols-1">
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
          </>
        ) : (
          <>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
              }}
            >
              Members
            </h2>
            <div className="grid grid-cols-1 grid-cols-2">
              {tour.members.map((member, index) => (
                <div key={member.user._id} className="card">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: "var(--primary)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        fontWeight: 600,
                      }}
                    >
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "1rem" }}>
                        {member.user.name}
                        {member.user._id === tour.captain._id && (
                          <span
                            className="badge badge-warning"
                            style={{ marginLeft: "0.5rem" }}
                          >
                            Captain
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--gray-600)",
                        }}
                      >
                        {member.user.email}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--gray-500)",
                          marginTop: "0.25rem",
                        }}
                      >
                        Joined{" "}
                        {format(new Date(member.joinedAt), "MMM dd, yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Add Expense Modal */}
        {showExpenseModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowExpenseModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Add New Expense</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowExpenseModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <ExpenseForm
                  members={tour.members}
                  onSubmit={handleAddExpense}
                  onCancel={() => setShowExpenseModal(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TourDetailsPage;
