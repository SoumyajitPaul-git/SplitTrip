import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const FinalReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/tours/${id}/report`);
      setReport(response.data.report);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="spinner"></div>
      </>
    );
  }

  if (error || !report) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: "2rem" }}>
          <div className="alert alert-error">{error || "Report not found"}</div>
          <button
            onClick={() => navigate(`/tour/${id}`)}
            className="btn btn-primary"
          >
            Back to Tour
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
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => navigate(`/tour/${id}`)}
            className="btn btn-outline btn-sm"
            style={{ marginBottom: "1rem" }}
          >
            ← Back to Tour
          </button>

          <h1 className="page-title">Final Settlement Report</h1>
          <p style={{ color: "var(--gray-600)", fontSize: "1.125rem" }}>
            {report.tour.name} • {report.tour.destination}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-label">Total Expenses</div>
            <div className="summary-value" style={{ color: "var(--primary)" }}>
              ₹{report.summary.totalExpenses.toFixed(2)}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Total Members</div>
            <div className="summary-value">{report.summary.totalMembers}</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Transactions</div>
            <div className="summary-value">
              {report.summary.totalTransactions}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Settlements Needed</div>
            <div
              className="summary-value"
              style={{ color: "var(--secondary)" }}
            >
              {report.settlements.length}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="report-section">
          <h2 className="report-section-title">Category Breakdown</h2>
          <div className="card">
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {Object.entries(report.summary.categoryBreakdown).map(
                ([category, amount]) => {
                  const percentage =
                    (amount / report.summary.totalExpenses) * 100;
                  const categoryColors = {
                    food: "#f59e0b",
                    transport: "#3b82f6",
                    accommodation: "#8b5cf6",
                    entertainment: "#ec4899",
                    shopping: "#10b981",
                    other: "var(--gray-400)",
                  };

                  return (
                    <div key={category}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            textTransform: "capitalize",
                            fontWeight: 500,
                          }}
                        >
                          {category}
                        </span>
                        <span style={{ fontWeight: 600 }}>
                          ₹{amount.toFixed(2)}
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          backgroundColor: "var(--gray-200)",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: "100%",
                            backgroundColor: categoryColors[category],
                            transition: "width 0.3s",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--gray-600)",
                          marginTop: "0.25rem",
                        }}
                      >
                        {percentage.toFixed(1)}% of total
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Member Balances */}
        <div className="report-section">
          <h2 className="report-section-title">Member Balances</h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            {report.memberBalances
              .sort((a, b) => b.netBalance - a.netBalance)
              .map((balance) => {
                const isPositive = balance.netBalance > 0.01;
                const isNegative = balance.netBalance < -0.01;
                const balanceClass = isPositive
                  ? "positive"
                  : isNegative
                  ? "negative"
                  : "neutral";

                return (
                  <div
                    key={balance.user.id}
                    className={`balance-card ${balanceClass}`}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "1.125rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {balance.user.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--gray-600)",
                          }}
                        >
                          Paid: ₹{balance.totalPaid.toFixed(2)} • Share: ₹
                          {balance.totalShare.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: isPositive
                              ? "var(--secondary)"
                              : isNegative
                              ? "var(--danger)"
                              : "var(--gray-600)",
                          }}
                        >
                          {isPositive ? "+" : ""}₹
                          {Math.abs(balance.netBalance).toFixed(2)}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--gray-600)",
                          }}
                        >
                          {isPositive
                            ? "To receive"
                            : isNegative
                            ? "To pay"
                            : "Settled"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Settlement Instructions */}
        <div className="report-section">
          <h2 className="report-section-title">
            Settlement Instructions
            {report.settlements.length === 0 && " ✅"}
          </h2>

          {report.settlements.length === 0 ? (
            <div
              className="card"
              style={{ textAlign: "center", padding: "3rem 2rem" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                All Settled!
              </h3>
              <p style={{ color: "var(--gray-600)" }}>
                No payments needed - everyone's expenses are balanced.
              </p>
            </div>
          ) : (
            <>
              <div
                className="alert alert-info"
                style={{ marginBottom: "1rem" }}
              >
                💡 Complete these {report.settlements.length} payment
                {report.settlements.length > 1 ? "s" : ""} to settle all
                expenses
              </div>

              <div style={{ display: "grid", gap: "1rem" }}>
                {report.settlements.map((settlement, index) => (
                  <div key={index} className="settlement-card">
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "1.125rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {settlement.from.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--gray-600)",
                          }}
                        >
                          Sender
                        </div>
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{ fontSize: "2rem", color: "var(--primary)" }}
                        >
                          →
                        </div>
                        <div
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: "var(--danger)",
                            marginTop: "0.5rem",
                          }}
                        >
                          ₹{settlement.amount.toFixed(2)}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "1.125rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {settlement.to.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--gray-600)",
                          }}
                        >
                          Receiver
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* All Expenses */}
        <div className="report-section">
          <h2 className="report-section-title">All Expenses</h2>
          <div className="card">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--gray-200)" }}>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        fontWeight: 600,
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        fontWeight: 600,
                      }}
                    >
                      Description
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        fontWeight: 600,
                      }}
                    >
                      Category
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        fontWeight: 600,
                      }}
                    >
                      Paid By
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      style={{ borderBottom: "1px solid var(--gray-200)" }}
                    >
                      <td
                        style={{
                          padding: "0.75rem",
                          fontSize: "0.875rem",
                          color: "var(--gray-600)",
                        }}
                      >
                        {format(new Date(expense.date), "MMM dd, yyyy")}
                      </td>
                      <td style={{ padding: "0.75rem", fontWeight: 500 }}>
                        {expense.description}
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <span
                          className={`badge badge-${
                            expense.category === "food" ? "warning" : "primary"
                          }`}
                        >
                          {expense.category}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
                        {expense.paidBy.name}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem",
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        ₹{expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button onClick={() => window.print()} className="btn btn-primary">
            🖨️ Print Report
          </button>
        </div>
      </div>
    </>
  );
};

export default FinalReportPage;
