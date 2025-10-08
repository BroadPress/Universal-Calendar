import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import api from '../api/api';
import DayCell from './DayCell';
import DayModal from './DayModal';

export default function CalendarGrid() {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => { fetchEvents(); }, [month]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events', { params: { month }});
      setEvents(res.data);
    } catch (err) {
      console.error(err);
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
    (acc[ev.date] ||= []).push(ev);
    return acc;
  }, {});

  return (
    <div className="flex-1 p-12">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">September <span className="text-gray-500">2025</span></h2>
        <div className="text-sm text-gray-600">‹ Today ›</div>
      </header>

      <div className="grid grid-cols-7 gap-4 text-sm">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(h => <div key={h} className="font-semibold text-gray-400">{h}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-6 mt-4">
        {gridCells.map((cell, idx) =>
          <DayCell key={idx}
                   cell={cell}
                   events={cell ? eventsByDate[cell.date] || [] : []}
                   onOpen={() => setSelectedDay(cell && cell.date)} />
        )}
      </div>

      {selectedDay && (
        <DayModal date={selectedDay} onClose={() => setSelectedDay(null)} events={eventsByDate[selectedDay] || []} />
      )}
    </div>
  );
}
