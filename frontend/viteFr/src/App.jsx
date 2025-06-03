import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tour from "./pages/Tour";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";

function App() {
  const isLoggedIn = true;
  const handleLogout = () => {};

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tour" element={<Tour />} />         // update it with /tour/:tourId
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
