import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            Split Travel Expenses
            <br />
            <span className="bg-gradient-to-r from-rose-500 to-indigo-600 bg-clip-text text-transparent">
              Without the Chaos
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Create tours, track shared expenses, and settle balances easily. No
            spreadsheets. No confusion. Just seamless trip management.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            {user ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition shadow-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-full bg-rose-500 text-white font-medium hover:bg-rose-600 transition shadow-lg"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="px-6 py-3 rounded-full border border-gray-300 bg-white hover:shadow-md transition font-medium"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl mb-4">🧳</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create Tours
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Organize trips with friends and generate secure join codes
                instantly.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl mb-4">💳</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Track Expenses
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Add shared expenses, assign participants, and split costs fairly
                and transparently.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Final Settlement
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get a clear breakdown showing exactly who owes whom — no awkward
                math.
              </p>
            </div>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} SplitTrip
        </footer>
      </div>
    </>
  );
};

export default HomePage;
