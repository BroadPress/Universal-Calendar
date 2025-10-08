import { useState, useEffect } from "react";
import { demoEvents } from "../data/demoEvents"; // ✅ Import demo events
import dayjs from "dayjs";

const Sidebar = () => {
  const [weekday, setWeekday] = useState('');
  const [todaysEvents, setTodaysEvents] = useState([]);

  const calendarCategories = [
    'Holidays','Festivals','International Days','National Days',
    'Birthdays','Anniversaries','Events','Others'
  ];

  useEffect(() => {
    const fetchTodayEvents = () => {
      const today = new Date();
      const formattedToday = dayjs(today).format('YYYY-MM-DD'); // "YYYY-MM-DD"
      const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      setWeekday(dayName);

      // Filter local demoEvents for today
      const eventsToday = demoEvents.filter(ev => ev.date === formattedToday);
      setTodaysEvents(eventsToday);
    };

    fetchTodayEvents();
    const interval = setInterval(fetchTodayEvents, 60 * 1000); // update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-72 p-10 border-r border-gray-300">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <img
          src="/images/sriyog-logo.svg" // 🔹 Replace with your logo URL
          alt="Logo"
          className="h-12 object-contain"
        />
      </div>

      {/* Date */}
      <div className="left-date flex flex-col items-center mt-6">
        <div className="big-num text-5xl font-bold">{new Date().getDate()}</div>
        <div className="weekday text-2xl mt-2">{weekday}</div>
      </div>

      {/* Calendar categories */}
      <div className="mt-10">
        <h4 className="font-semibold">All Calendar</h4>
        <ul className="mt-4 space-y-3">
          {calendarCategories.map((x) =>
            <li key={x} className="flex items-center gap-3">
              <input type="checkbox" />
              <span className="text-sm text-gray-700">{x}</span>
            </li>
          )}
        </ul>
      </div>

      {/* Today's events */}
      <div className="mt-8 border-t pt-6">
        <h5 className="text-sm text-gray-500">Today's Attraction</h5>
        {todaysEvents.length > 0 ? (
          todaysEvents.map(event => (
            <div key={event.id} className="mt-4 p-4 border rounded bg-white">
              <div className="text-xs text-gray-400">{event.date}</div>
              <div className="mt-3 font-medium">{event.title}</div>
            </div>
          ))
        ) : (
          <div className="mt-4 p-4 border rounded bg-white text-gray-400">
            No events today
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
