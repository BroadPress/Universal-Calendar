import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import DayCell from './DayCell';
import DayModal from './DayModal';

export default function CalendarGrid() {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // For individual event details

  const currentDate = dayjs(month + '-01');
  const currentYear = currentDate.year();
  const currentMonth = currentDate.month(); // 0–11

  // Fetch events from backend whenever month changes
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events', {
        params: {
          year: currentYear,
          month: currentDate.format('MMMM'), // "October"
        },
      });
      console.log("Fetched events from backend:", response.data);
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };
  fetchEvents();
}, [month]);
  const handleMonthChange = (e) => {
    const newMonth = Number(e.target.value);
    const newDate = dayjs().year(currentYear).month(newMonth).format('YYYY-MM');
    setMonth(newDate);
  };

  const handleYearChange = (e) => {
    const newYear = Number(e.target.value);
    const newDate = dayjs().year(newYear).month(currentMonth).format('YYYY-MM');
    setMonth(newDate);
  };

  const handleToday = () => {
    setMonth(dayjs().format('YYYY-MM'));
  };

  // Calendar grid generation
  const monthStart = dayjs(month + '-01');
  const startWeekDay = monthStart.startOf('month').day();
  const daysInMonth = monthStart.daysInMonth();

  const gridCells = [];
  for (let i = 0; i < startWeekDay; i++) gridCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = monthStart.date(d).format('YYYY-MM-DD');
    gridCells.push({ date, day: d });
  }
  while (gridCells.length % 7 !== 0) gridCells.push(null);

  // Group events by date
 const eventsByDate = events.reduce((acc, ev) => {
  // Convert month name to month number (0–11)
  const monthIndex = new Date(`${ev.date.month} 1`).getMonth() + 1;
  const key = `${ev.date.year}-${String(monthIndex).padStart(2,'0')}-${String(ev.date.day).padStart(2,'0')}`;
  (acc[key] ||= []).push(ev);
  return acc;
}, {});

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = [2025, 2026];

  // Handle clicking an event or "view more"
  const handleEventClick = (event) => {
    setSelectedEvent(event); // Open event modal for individual event
  };

  return (
    <div className="flex-1 p-12 overflow-y-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        {/* Month & Year Dropdowns */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={currentMonth}
              onChange={handleMonthChange}
              className="appearance-none bg-transparent text-2xl font-semibold text-gray-800 cursor-pointer focus:outline-none hover:text-red-900 transition-colors"
            >
              {months.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-red-900 pointer-events-none">▼</span>
          </div>

          <div className="relative">
            <select
              value={currentYear}
              onChange={handleYearChange}
              className="appearance-none bg-transparent text-2xl font-medium text-gray-700 pr-6 cursor-pointer focus:outline-none hover:text-red-900 transition-colors"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-red-900 pointer-events-none">▼</span>
          </div>
        </div>

        {/* Today Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMonth(dayjs(month).subtract(1, 'month').format('YYYY-MM'))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            &lt;
          </button>

          <button
            onClick={handleToday}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm text-gray-600 font-medium transition-colors"
          >
            Today
          </button>

          <button
            onClick={() => setMonth(dayjs(month).add(1, 'month').format('YYYY-MM'))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            &gt;
          </button>
        </div>
      </header>

      {/* Week headers */}
      <div className="grid grid-cols-7 gap-4 text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(h => (
          <div key={h} className="font-semibold text-gray-400">{h}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-6 mt-4">
        {gridCells.map((cell, idx) => (
          <DayCell
  key={idx}
  cell={cell}
  events={cell ? eventsByDate[cell.date] || [] : []}
  onOpenEvent={handleEventClick}
/>
        ))}
      </div>

      {/* Day modal (show all events for a day) */}
      {selectedDay && !selectedEvent && (
        <DayModal
          date={selectedDay}
          onClose={() => setSelectedDay(null)}
          events={eventsByDate[selectedDay] || []}
        />
      )}

      {/* Event modal (show individual event details) */}
      {selectedEvent && (
        <DayModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
