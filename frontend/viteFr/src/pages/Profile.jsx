import CreateTour from "../components/CreateTour";
import JoinTour from "../components/JoinTour";
import Dashboard from "../components/Dashboard";

// Dummy data
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

const Profile = () => {
  return (
    <div className="p-6 space-y-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-400 mb-6">My Profile</h2>
      <CreateTour onCreate={(tourObj) => console.log("Created:", tourObj)} />
      <JoinTour />
      <Dashboard tourId="T12345" payments={dummyPayments} />
    </div>
  );
};

export default Profile;
