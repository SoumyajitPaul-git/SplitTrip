// src/components/AddExpense.jsx
import { useState } from "react";

export default function AddExpense({ participants = [], onAddExpense }) {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState(
    new Set(participants)
  );

  const handleToggleParticipant = (person) => {
    const updated = new Set(selectedParticipants);
    if (updated.has(person)) {
      updated.delete(person);
    } else { 
      updated.add(person);
    }
    setSelectedParticipants(updated);
  };

  const handleSelectAll = () => {
    setSelectedParticipants(new Set(participants));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && purpose && selectedParticipants.size > 0) {
      onAddExpense({
        amount: parseFloat(amount),
        purpose,
        splitWith: Array.from(selectedParticipants),
      });
      setAmount("");
      setPurpose("");
      setSelectedParticipants(new Set(participants));
    }
  };

  
  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-800 rounded-lg shadow-lg text-white"
    >
      <h3 className="text-xl font-semibold mb-6">Add Expense</h3>

      <div className="mb-4">
        <label className="block mb-2">Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 bg-gray-700 text-white border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Purpose</label>
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Enter purpose"
          className="w-full p-2 bg-gray-700 text-white border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Split With</label>

        <div className="flex items-center gap-4 mb-4">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Select All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {participants.map((person) => (
            <label key={person} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedParticipants.has(person)}
                onChange={() => handleToggleParticipant(person)}
                className="accent-blue-500"
              />
              {person}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        Add Expense
      </button>
    </form>
  );
}
