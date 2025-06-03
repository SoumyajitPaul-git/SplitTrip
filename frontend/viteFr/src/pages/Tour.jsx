// src/pages/Tour.jsx
import { useState } from "react";
import Dashboard from "../components/Dashboard";
import AddExpense from "../components/AddExpense";

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
];

const dummyParticipants = ["Alice", "Bob", "Charlie"];

export default function Tour() {
  const [payments, setPayments] = useState(dummyPayments); 
  const tourId = "tour_123abc"; // Replace with dynamic ID later

  const handleAddExpense = (newExpense) => {
    const newPayment = {
      ...newExpense,
      paidBy: "CurrentUser",
      date: new Date().toISOString().split("T")[0],
    };
    setPayments([...payments, newPayment]);
  };

  return (
    <div className="p-6 space-y-8 bg-black">
      <Dashboard tourId={tourId} payments={payments} />
      <AddExpense participants={dummyParticipants} onAddExpense={handleAddExpense} />
    </div>
  );
}
