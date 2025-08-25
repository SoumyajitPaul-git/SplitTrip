export default function ExpenseCard({ expense }) {
  return (
    <div className="border p-3 rounded shadow bg-gray-50">
      <p>
        <strong>{expense.purpose}</strong> - ₹{expense.amount}
      </p>
      <p className="text-sm text-gray-600">Paid by: {expense.paidBy?.name}</p>
      <p className="text-sm text-gray-500">
        {new Date(expense.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
