import { useState, useEffect, Fragment } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { Listbox, Transition } from '@headlessui/react';
import DayCell from './DayCell';
import DayModal from './DayModal';

export default function CalendarGrid() {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const MIN_YEAR = 2025;
  const MAX_YEAR = 2026;

  const currentDate = dayjs(month + '-01');
  const currentYear = currentDate.year();
  const currentMonth = currentDate.month();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = [2025, 2026];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events', {
          params: { year: currentYear, month: currentDate.format('MMMM') },
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, [month]);

  const handleToday = () => {
    const today = dayjs();
    if (today.year() >= MIN_YEAR && today.year() <= MAX_YEAR) {
      setMonth(today.format('YYYY-MM'));
    } else {
      setMonth(`${MIN_YEAR}-01`);
    }
  };

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

  const eventsByDate = events.reduce((acc, ev) => {
    const monthIndex = new Date(`${ev.date.month} 1`).getMonth() + 1;
    const key = `${ev.date.year}-${String(monthIndex).padStart(2, '0')}-${String(ev.date.day).padStart(2, '0')}`;
    (acc[key] ||= []).push(ev);
    return acc;
  }, {});

  const handleEventClick = (event) => setSelectedEvent(event);

  return (
    <div className="flex-1 p-12 overflow-y-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        {/* Left: Month & Year Dropdowns */}
        <div className="flex items-center gap-3">
          {/* Month Dropdown */}
          <div className="relative w-36">
            <Listbox value={currentMonth} onChange={(m) => setMonth(dayjs().year(currentYear).month(m).format('YYYY-MM'))}>
              <Listbox.Button className="relative w-full cursor-pointer bg-white rounded-lg py-2 pl-4 pr-10 text-left shadow-sm">
                <span className="font-bold text-xl">{months[currentMonth]}</span>
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-[#7b1515]">▼</span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none z-10">
                  {months.map((m, idx) => (
                    <Listbox.Option
                      key={idx}
                      value={idx}
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-2 pl-4 pr-4 ${active ? 'bg-red-100 text-red-900' : 'text-gray-900'}`
                      }
                    >
                      {m}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>

          {/* Year Dropdown */}
          <div className="relative w-28">
            <Listbox value={currentYear} onChange={(y) => setMonth(dayjs().year(y).month(currentMonth).format('YYYY-MM'))}>
              <Listbox.Button className="relative w-full cursor-pointer bg-white rounded-lg py-2 pl-4 pr-10 text-left shadow-sm">
                <span className="text-xl">{currentYear}</span>
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-[#7b1515]">▼</span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none z-10">
                  {years.map((y) => (
                    <Listbox.Option
                      key={y}
                      value={y}
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-2 pl-4 pr-4 ${active ? 'bg-red-100 text-red-900' : 'text-gray-900'}`
                      }
                    >
                      {y}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>
        </div>

        {/* Right: Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMonth(dayjs(month).subtract(1, 'month').format('YYYY-MM'))}
            className={`px-3 py-1 rounded ${dayjs(month).subtract(1, 'month').year() < MIN_YEAR ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
            disabled={dayjs(month).subtract(1, 'month').year() < MIN_YEAR}
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
            className={`px-3 py-1 rounded ${dayjs(month).add(1, 'month').year() > MAX_YEAR ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
            disabled={dayjs(month).add(1, 'month').year() > MAX_YEAR}
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
            onSelectDay={(date) => setSelectedDay(date)}
          />
        ))}
      </div>

      {/* Day modal */}
      {selectedDay && !selectedEvent && (
        <DayModal
          date={selectedDay}
          onClose={() => setSelectedDay(null)}
          events={eventsByDate[selectedDay] || []}
        />
      )}
      {selectedEvent && (
        <DayModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
