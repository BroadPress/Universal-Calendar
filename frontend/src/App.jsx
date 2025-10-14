import CalendarGrid from "./components/CalendarGrid";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <CalendarGrid />
    </div>
  )
}
