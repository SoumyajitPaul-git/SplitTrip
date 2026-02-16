import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import CreateTourPage from "./pages/CreateTourPage";
import TourDetailsPage from "./pages/TourDetailsPage";
import FinalReportPage from "./pages/FinalReportPage";
import HomePage from "./pages/HomePage";

/* Protected Route */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

/* Public Route */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/profile" />;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Landing */}
        <Route path="/" element={<HomePage />} />

        {/* Auth */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-tour"
          element={
            <ProtectedRoute>
              <CreateTourPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tour/:id"
          element={
            <ProtectedRoute>
              <TourDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tour/:id/report"
          element={
            <ProtectedRoute>
              <FinalReportPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
