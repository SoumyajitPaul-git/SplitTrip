import { format } from "date-fns";

const ExpenseCard = ({ expense, onDelete, canDelete }) => {
  const getCategoryColor = (category) => {
    const colors = {
      food: "border-yellow-400",
      transport: "border-blue-400",
      accommodation: "border-purple-400",
      entertainment: "border-pink-400",
      shopping: "border-green-400",
      other: "border-gray-300",
    };
    return colors[category] || colors.other;
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border-l-4 ${getCategoryColor(
        expense.category,
      )} p-6 transition hover:shadow-md`}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">{expense.description}</h3>

          <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full capitalize">
            {expense.category}
          </span>
        </div>

        <div className="text-xl font-bold text-rose-600">
          ₹{expense.amount.toFixed(2)}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>💳</span>
          <span>
            Paid by:{" "}
            <span className="font-medium text-gray-800">
              {expense.paidBy?.name || "Unknown"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>👥</span>
          <span>
            Split among:{" "}
            <span className="text-gray-800">
              {expense.participants?.map((p) => p.name).join(", ")}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>
            {format(new Date(expense.date), "MMM dd, yyyy - hh:mm a")}
          </span>
        </div>

        {expense.createdBy && (
          <div className="flex items-center gap-2">
            <span>✏️</span>
            <span>Added by: {expense.createdBy.name}</span>
          </div>
        )}
      </div>

      {/* Delete */}
      {canDelete && onDelete && (
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm("Are you sure you want to delete this expense?")
              ) {
                onDelete(expense._id);
              }
            }}
            className="text-sm px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
