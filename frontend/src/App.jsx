import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import CalendarGrid from "./components/CalendarGrid";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [selectedTypes, setSelectedTypes] = useState([]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<AdminSignup />} />

        {/* ✅ Protected route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <Sidebar
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                />
                <div className="flex-1 overflow-auto">
                  <CalendarGrid selectedTypes={selectedTypes} />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
