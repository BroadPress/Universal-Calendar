import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import CalendarGrid from "./components/CalendarGrid";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";

export default function App() {
  const [selectedTypes, setSelectedTypes] = useState([]);

  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<AdminSignup />} />

        {/* Main calendar page with sidebar */}
        <Route
          path="/"
          element={
            <div className="flex h-screen">
              <Sidebar selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
              <div className="flex-1 overflow-auto">
                <CalendarGrid selectedTypes={selectedTypes} />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
