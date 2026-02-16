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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  if (error || !report) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
            <p className="text-red-500 mb-4">{error || "Report not found"}</p>
            <button
              onClick={() => navigate(`/tour/${id}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Back to Tour
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div>
            <button
              onClick={() => navigate(`/tour/${id}`)}
              className="mb-4 text-sm text-indigo-600 hover:underline"
            >
              ← Back to Tour
            </button>

            <h1 className="text-3xl font-bold text-gray-800">
              Final Settlement Report
            </h1>
            <p className="text-gray-500 mt-2">
              {report.tour.name} • {report.tour.destination}
            </p>
          </div>

          {/* Summary */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              label="Total Expenses"
              value={`₹${report.summary.totalExpenses.toFixed(2)}`}
            />
            <SummaryCard
              label="Total Members"
              value={report.summary.totalMembers}
            />
            <SummaryCard
              label="Transactions"
              value={report.summary.totalTransactions}
            />
            <SummaryCard
              label="Settlements Needed"
              value={report.settlements.length}
            />
          </div>

          {/* Category Breakdown */}
          <Section title="Category Breakdown">
            <div className="space-y-4">
              {Object.entries(report.summary.categoryBreakdown).map(
                ([category, amount]) => {
                  const percentage =
                    (amount / report.summary.totalExpenses) * 100;

                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="capitalize font-medium">
                          {category}
                        </span>
                        <span className="font-semibold">
                          ₹{amount.toFixed(2)}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          </Section>

          {/* Member Balances */}
          <Section title="Member Balances">
            <div className="space-y-4">
              {report.memberBalances
                .sort((a, b) => b.netBalance - a.netBalance)
                .map((balance) => {
                  const isPositive = balance.netBalance > 0.01;
                  const isNegative = balance.netBalance < -0.01;

                  return (
                    <div
                      key={balance.user.id}
                      className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold text-lg">
                          {balance.user.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Paid: ₹{balance.totalPaid.toFixed(2)} • Share: ₹
                          {balance.totalShare.toFixed(2)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-xl font-bold ${
                            isPositive
                              ? "text-green-600"
                              : isNegative
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          {isPositive ? "+" : ""}₹
                          {Math.abs(balance.netBalance).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isPositive
                            ? "To receive"
                            : isNegative
                              ? "To pay"
                              : "Settled"}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Section>

          {/* Settlement Instructions */}
          <Section title="Settlement Instructions">
            {report.settlements.length === 0 ? (
              <div className="bg-white p-10 rounded-xl shadow-sm text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold mb-2">All Settled!</h3>
                <p className="text-gray-500">
                  No payments needed - everyone's expenses are balanced.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {report.settlements.map((settlement, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{settlement.from.name}</p>
                      <p className="text-xs text-gray-500">Sender</p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-500">
                        ₹{settlement.amount.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">{settlement.to.name}</p>
                      <p className="text-xs text-gray-500">Receiver</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Print */}
          <div className="text-center">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              🖨️ Print Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const SummaryCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-indigo-600 mt-2">{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    {children}
  </div>
);

export default FinalReportPage;
