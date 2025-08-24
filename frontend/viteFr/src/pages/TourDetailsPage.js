import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseForm from "../components/ExpenseForm";

export default function TourDetailsPage() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/tours/${id}`, {
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then((data) => {
        setTour(data.tour);
        setExpenses(data.expenses || []);
      });
  }, [id]);

  const handleExpenseAdded = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{tour?.name}</h1>
        <p className="mb-4 text-gray-600">{tour?.description}</p>

        {tour && (
          <ExpenseForm
            tourId={tour._id}
            members={tour.members}
            onExpenseAdded={handleExpenseAdded}
          />
        )}

        <h2 className="text-lg font-semibold mt-8 mb-3">All Expenses</h2>
        <div className="space-y-2">
          {expenses.map((exp) => (
            <ExpenseCard key={exp._id} expense={exp} />
          ))}
        </div>
      </div>
    </>
  );
}
