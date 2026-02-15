import { format } from "date-fns";

const ExpenseCard = ({ expense, onDelete, canDelete }) => {
  const getCategoryColor = (category) => {
    const colors = {
      food: "border-l-yellow-500",
      transport: "border-l-blue-500",
      accommodation: "border-l-purple-500",
      entertainment: "border-l-pink-500",
      shopping: "border-l-green-500",
      other: "border-l-gray-400",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className={`expense-card ${getCategoryColor(expense.category)}`}>
      <div className="expense-card-header">
        <div>
          <div className="expense-description">{expense.description}</div>
          <span
            className={`badge badge-${
              expense.category === "food" ? "warning" : "primary"
            } mt-2 text-[0.7rem]`}
          >
            {expense.category}
          </span>
        </div>
        <div className="expense-amount">₹{expense.amount.toFixed(2)}</div>
      </div>

      <div className="expense-details">
        <div className="expense-detail-row">
          <span>💳</span>
          <span>
            Paid by: <strong>{expense.paidBy?.name || "Unknown"}</strong>
          </span>
        </div>

        <div className="expense-detail-row">
          <span>👥</span>
          <span>
            Split among: {expense.participants?.map((p) => p.name).join(", ")}
          </span>
        </div>

        <div className="expense-detail-row">
          <span>📅</span>
          <span>
            {format(new Date(expense.date), "MMM dd, yyyy - hh:mm a")}
          </span>
        </div>

        {expense.createdBy && (
          <div className="expense-detail-row">
            <span>✏️</span>
            <span>Added by: {expense.createdBy.name}</span>
          </div>
        )}
      </div>

      {canDelete && onDelete && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm("Are you sure you want to delete this expense?")
              ) {
                onDelete(expense._id);
              }
            }}
            className="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
