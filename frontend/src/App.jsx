import { useState } from "react";
import Sidebar from "./components/Sidebar";
import CalendarGrid from "./components/CalendarGrid";

export default function App() {
  const [selectedTypes, setSelectedTypes] = useState([]);

  return (
    <div className="flex h-screen">
      <Sidebar selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
      <div className="flex-1 overflow-auto">
        <CalendarGrid selectedTypes={selectedTypes} />
      </div>
    </div>
  );
}
