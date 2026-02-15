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
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">Description *</label>
        <input
          type="text"
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g., Dinner at restaurant"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Amount (₹) *</label>
        <input
          type="number"
          name="amount"
          className="form-control"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          min="0"
          placeholder="0.00"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          name="category"
          className="form-control"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="accommodation">Accommodation</option>
          <option value="entertainment">Entertainment</option>
          <option value="shopping">Shopping</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Paid By *</label>
        <select
          name="paidBy"
          className="form-control"
          value={formData.paidBy}
          onChange={handleChange}
        >
          <option value="">Select member</option>
          {members.map((member) => (
            <option key={member.user._id} value={member.user._id}>
              {member.user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <div className="flex justify-between items-center mb-2">
          <label className="form-label mb-0">Split Among *</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAllParticipants}
              className="btn btn-sm text-xs px-2 py-1"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearParticipants}
              className="btn btn-sm text-xs px-2 py-1"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="checkbox-list">
          {members.map((member) => (
            <label key={member.user._id} className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.participants.includes(member.user._id)}
                onChange={() => handleParticipantToggle(member.user._id)}
              />
              <span>{member.user.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="modal-footer p-0 border-0 mt-6">
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Add Expense
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
