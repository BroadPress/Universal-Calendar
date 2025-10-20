import { useState, useEffect, Fragment } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { Listbox, Transition } from '@headlessui/react';
import DayCell from './DayCell';
import DayModal from './DayModal';

export default function CalendarGrid({ selectedTypes }) {
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
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = [2025, 2026];

  const typeMap = {
    Holidays: "Holiday",
    Festivals: "Nepali Festivals",
    "International Days": "International Days",
    "National Days": "National Days",
    Birthdays: "Birthday",
    Anniversaries: "Anniversaries",
    Events: null,
    Others: null
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events', {
          params: { year: currentYear, month: currentDate.format('MMMM') },
        });
        const filteredEvents = selectedTypes.length > 0
          ? response.data.filter(ev => selectedTypes.some(sel => typeMap[sel] === ev.eventType))
          : response.data;
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, [month, selectedTypes]);

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

  const handleEventClick = (event) => {
    if (event.showAll) {
      setSelectedDay(event.date);
      setSelectedEvent(null);
    } else {
      setSelectedEvent(event); // ✅ full event object with description
      setSelectedDay(null);
    }
  };
  const handleSelectDay = (date) => {
    setSelectedDay(date);
    setSelectedEvent(null);
  };
  const handleCloseModal = () => {
    setSelectedDay(null);
    setSelectedEvent(null);
  };
  const handleToday = () => {
    const today = dayjs();
    if (today.year() >= MIN_YEAR && today.year() <= MAX_YEAR) {
      setMonth(today.format('YYYY-MM'));
    } else {
      setMonth(`${MIN_YEAR}-01`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full p-6">
      {/* Sticky Header */}
      <div className="flex-shrink-0 sticky top-0 bg-white z-20">
        {/* Month/Year selectors + Navigation */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Month Selector */}
            <div className="relative w-36">
              <Listbox
                value={currentMonth}
                onChange={(m) =>
                  setMonth(dayjs().year(currentYear).month(m).format("YYYY-MM"))
                }
              >
                <Listbox.Button className="relative w-full cursor-pointer bg-white rounded-lg py-2.5 pl-4 pr-10 text-left shadow-sm text-lg font-normal border border-gray-200">
                  <span>{months[currentMonth]}</span>
                  <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-[#7b1515]">
                    ▼
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none z-30">
                    {months.map((m, idx) => (
                      <Listbox.Option
                        key={idx}
                        value={idx}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pl-4 pr-4 ${active ? "bg-red-100 text-red-900" : "text-gray-900"
                          }`
                        }
                      >
                        {m}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </Listbox>
            </div>

            {/* Year Selector */}
            <div className="relative w-28">
              <Listbox
                value={currentYear}
                onChange={(y) =>
                  setMonth(dayjs().year(y).month(currentMonth).format("YYYY-MM"))
                }
              >
                <Listbox.Button className="relative w-full cursor-pointer bg-white rounded-lg py-2.5 pl-4 pr-10 text-left shadow-sm text-lg font-bold border border-gray-200">
                  <span>{currentYear}</span>
                  <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-[#7b1515]">
                    ▼
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none z-30">
                    {years.map((y) => (
                      <Listbox.Option
                        key={y}
                        value={y}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pl-4 pr-4 ${active ? "bg-red-100 text-red-900" : "text-gray-900"
                          }`
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

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setMonth(dayjs(month).subtract(1, "month").format("YYYY-MM"))
              }
              className={`px-4 py-2 text-sm rounded border border-gray-300 ${dayjs(month).subtract(1, "month").year() < MIN_YEAR
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
                }`}
              disabled={dayjs(month).subtract(1, "month").year() < MIN_YEAR}
            >
              &lt;
            </button>

            <button
              onClick={handleToday}
              className="px-5 py-2 text-sm rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            >
              Today
            </button>

            <button
              onClick={() => setMonth(dayjs(month).add(1, "month").format("YYYY-MM"))}
              className={`px-4 py-2 text-sm rounded border border-gray-300 ${dayjs(month).add(1, "month").year() > MAX_YEAR
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
                }`}
              disabled={dayjs(month).add(1, "month").year() > MAX_YEAR}
            >
              &gt;
            </button>
          </div>
        </header>
        {/* Week headers */}
        <div className="grid grid-cols-7 gap-4 text-sm border-b border-gray-300 bg-white sticky top-[72px] z-10">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(h => (<div key={h} className="font-semibold text-gray-400">{h}</div>))}
        </div>
      </div>

      {/* Scrollable Calendar Grid */}
      <div className="flex-1 overflow-y-auto mt-4">
        <div className="grid grid-cols-7 border-t border-l border-gray-300">
          {gridCells.map((cell, idx) => (
            <DayCell
              key={idx}
              cell={cell}
              events={cell ? eventsByDate[cell.date] || [] : []}
              onOpenEvent={handleEventClick}
              onSelectDay={handleSelectDay}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedEvent && <DayModal event={selectedEvent} date={selectedEvent.date} onClose={handleCloseModal} />}
      {selectedDay && !selectedEvent && (
        <DayModal
          date={selectedDay}
          onClose={handleCloseModal}
          events={eventsByDate[selectedDay]?.filter(ev => selectedTypes.length === 0 || selectedTypes.some(sel => typeMap[sel] === ev.eventType)) || []}
        />
      )}
    </div>
  );
}
