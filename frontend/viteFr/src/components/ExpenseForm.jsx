import { useState } from "react";

const ExpenseForm = ({ members, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "other",
    paidBy: "",
    participants: [],
    splitType: "equal",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipantToggle = (memberId) => {
    setFormData((prev) => {
      const isSelected = prev.participants.includes(memberId);
      return {
        ...prev,
        participants: isSelected
          ? prev.participants.filter((id) => id !== memberId)
          : [...prev.participants, memberId],
      };
    });
  };

  const selectAllParticipants = () => {
    setFormData((prev) => ({
      ...prev,
      participants: members.map((m) => m.user._id),
    }));
  };

  const clearParticipants = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (!formData.paidBy) {
      setError("Please select who paid");
      return;
    }

    if (formData.participants.length === 0) {
      setError("Please select at least one participant");
      return;
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g., Dinner at restaurant"
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none transition"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium mb-2">Amount (₹) *</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          min="0"
          placeholder="0.00"
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none transition"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none transition bg-white"
        >
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="accommodation">Accommodation</option>
          <option value="entertainment">Entertainment</option>
          <option value="shopping">Shopping</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Paid By */}
      <div>
        <label className="block text-sm font-medium mb-2">Paid By *</label>
        <select
          name="paidBy"
          value={formData.paidBy}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none transition bg-white"
        >
          <option value="">Select member</option>
          {members.map((member) => (
            <option key={member.user._id} value={member.user._id}>
              {member.user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Participants */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium">Split Among *</label>

          <div className="flex gap-3 text-xs">
            <button
              type="button"
              onClick={selectAllParticipants}
              className="text-rose-600 hover:underline"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearParticipants}
              className="text-gray-500 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {members.map((member) => {
            const selected = formData.participants.includes(member.user._id);

            return (
              <label
                key={member.user._id}
                className={`flex items-center gap-3 border rounded-xl px-4 py-2 cursor-pointer transition ${
                  selected
                    ? "border-rose-500 bg-rose-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleParticipantToggle(member.user._id)}
                  className="accent-rose-500"
                />
                <span className="text-sm">{member.user.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 border rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
        >
          Add Expense
        </button>
      </div>
    </form>
  );

};

export default ExpenseForm;
