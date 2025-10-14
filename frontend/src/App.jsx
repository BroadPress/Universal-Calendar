// frontend/src/App.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import CalendarGrid from "./components/CalendarGrid";

export default function App() {
  const [selectedTypes, setSelectedTypes] = useState([]); // holds selected filters

  return (
    <div className="flex">
      <Sidebar selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
      <CalendarGrid selectedTypes={selectedTypes} />
    </div>
  );
}
