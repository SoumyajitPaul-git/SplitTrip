import React, { useState, useEffect } from "react";
import axios from "axios";

const ExpenseForm = ({ tourId, members, onExpenseAdded }) => {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Optionally fetch current user from local storage or backend
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  const toggleMember = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMembers([]);
    } else {
      const allIds = members.map((m) => m._id);
      setSelectedMembers(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/expenses`,
        {
          tourId,
          amount,
          purpose,
          splitWith: selectedMembers,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setAmount("");
      setPurpose("");
      setSelectedMembers([]);
      setSelectAll(false);
      onExpenseAdded(res.data); // callback to update parent state
    } catch (err) {
      console.error("Error adding expense", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-lg font-semibold mb-2">Add Expense</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
      />

      <input
        type="text"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="Purpose"
        required
        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
      />

      <div className="mt-2">
        <label className="font-semibold text-sm mb-1 block">Split With:</label>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            All
          </label>
          {members.map((member) => (
            <label key={member._id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedMembers.includes(member._id)}
                onChange={() => toggleMember(member._id)}
              />
              {member.name}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
      >
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
