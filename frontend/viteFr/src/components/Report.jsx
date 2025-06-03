import React from "react";

const dummyPayments = [
  {
    paidBy: "Alice",
    amount: 1200,
    purpose: "Dinner",
    splitWith: ["Bob", "Charlie"],
    date: "2025-03-09",
  },
  {
    paidBy: "Bob",
    amount: 800,
    purpose: "Snacks",
    splitWith: ["Alice", "Charlie"],
    date: "2025-03-08",
  },
  {
    paidBy: "Charlie",
    amount: 600,
    purpose: "Cab",
    splitWith: ["Alice", "Bob"],
    date: "2025-03-07",
  },
];

const calculateBalances = (payments) => {
  const balances = {};

  payments.forEach(({ paidBy, amount, splitWith }) => {
    const perPersonShare = amount / (splitWith.length + 1); // including payer

    // Payer gets credit
    balances[paidBy] = (balances[paidBy] || 0) + amount - perPersonShare;

    // Each splitter owes their share
    splitWith.forEach((person) => {
      balances[person] = (balances[person] || 0) - perPersonShare;
    });
  });

  return balances;
};

const Report = () => {
  const balances = calculateBalances(dummyPayments);
  const participants = Object.keys(balances);

  return (
    <div className="bg-gray-800 p-6 rounded-xl text-white mt-6">
      <h2 className="text-xl font-bold mb-4">Tour Summary Report</h2>
      <div className="space-y-4">
        {participants.map((person) => (
          <div
            key={person}
            className={`p-4 rounded-lg ${
              balances[person] >= 0 ? "bg-green-700" : "bg-red-700"
            }`}
          >
            <p className="text-lg font-semibold">{person}</p>
            <p>
              Net Balance:{" "}
              <span className="font-bold">₹{balances[person].toFixed(2)}</span>{" "}
              {balances[person] >= 0 ? "(To Receive)" : "(To Pay)"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Report;
