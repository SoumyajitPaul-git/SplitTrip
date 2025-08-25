import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Tour from "./pages/Tour";
// import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
// import Profile from "./pages/Profile";
import CreateTourPage from "./pages/CreateTourPage";
import DashboardPage from "./pages/DashboardPage";
import FinalReportPage from "./pages/FinalReportPage";
import TourDetailsPage from "./pages/TourDetailsPage";

function App() {
  const isLoggedIn = true;
  const handleLogout = () => {};

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tour" element={<Tour />} />         // update it with /tour/:tourId
        <Route path="*" element={<NotFound />} /> */}
        <Route
          path="/"
          element={
            <>
              <h1>Home</h1>
            </>
          }
        />
        <Route path="/create-tour" element={<CreateTourPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/final-report" element={<FinalReportPage />} /> 
        <Route path="/tour-details" element={<TourDetailsPage />} />

      </Routes>
    </Router>
  );
}

export default App;
