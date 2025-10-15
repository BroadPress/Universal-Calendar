// frontend/src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";

const Sidebar = ({ selectedTypes, setSelectedTypes }) => {
  const [weekday, setWeekday] = useState('');
  const [todaysEvents, setTodaysEvents] = useState([]);

  const calendarCategories = [
    'Holidays', 'Festivals', 'International Days', 'National Days',
    'Birthdays', 'Anniversaries', 'Events', 'Others'
  ];

  useEffect(() => {
    const fetchTodayEvents = async () => {
      const today = dayjs();
      const formattedToday = today.format('YYYY-MM-DD');
      setWeekday(today.format('dddd').toUpperCase());

      try {
        const response = await axios.get('http://localhost:5000/api/events', {
          params: {
            year: today.year(),
            month: today.format('MMMM')
          },
        });

        const events = response.data;

        const todays = events.filter(ev => {
          const evMonthIndex = new Date(`${ev.date.month} 1`).getMonth() + 1;
          const evDateStr = `${ev.date.year}-${String(evMonthIndex).padStart(2,'0')}-${String(ev.date.day).padStart(2,'0')}`;
          return evDateStr === formattedToday;
        });

        setTodaysEvents(todays);
      } catch (err) {
        console.error("Failed to fetch today's events:", err);
        setTodaysEvents([]);
      }
    };

    fetchTodayEvents();
    const interval = setInterval(fetchTodayEvents, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Handle checkbox toggle
  const handleToggle = (label) => {
    setSelectedTypes(prev =>
      prev.includes(label)
        ? prev.filter(t => t !== label)
        : [...prev, label]
    );
  };

  return (
    <aside className="w-72 p-10 border-r border-gray-300 sticky top-0 h-screen bg-white overflow-y-auto">
  <div className="mb-8 flex justify-center">
    <img src="/images/sriyog-logo.svg" alt="Logo" className="h-12 object-contain" />
  </div>

  <div className="left-date flex flex-col items-center mt-6">
    <div className="big-num text-5xl font-bold">{dayjs().date()}</div>
    <div className="weekday text-2xl mt-2">{weekday}</div>
  </div>

  <div className="mt-10">
    <h4 className="font-semibold">All Calendar</h4>
    <ul className="mt-4 space-y-3">
      {calendarCategories.map((x) => (
        <li key={x} className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedTypes.includes(x)}
            onChange={() => handleToggle(x)}
          />
          <span className="text-sm text-gray-700">{x}</span>
        </li>
      ))}
    </ul>
  </div>

  <div className="mt-8 border-t pt-6">
    <h5 className="text-sm text-gray-500">Today's Attraction</h5>
    {todaysEvents.length > 0 ? (
      todaysEvents.map(event => (
        <div key={event._id} className="mt-4 p-4 border rounded bg-white">
          <div className="text-xs text-gray-400">
            {dayjs(`${event.date.year}-${event.date.month}-${event.date.day}`).format('YYYY-MM-DD')}
          </div>
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
