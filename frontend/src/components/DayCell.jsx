import React from 'react';

export default function DayCell({ cell, events, onOpen }) {
  if (!cell) return <div className="h-28"></div>; // blank cell

  return (
    <div className="min-h-28 p-3 bg-transparent rounded cursor-pointer" onClick={onOpen}>
      <div className="text-xs text-gray-400 mb-2">{cell.day}</div>
      <div className="space-y-2">
        {events.slice(0,3).map((ev) => (
          <div key={ev._id} className="text-xs px-2 py-1 rounded text-black" style={{ background: ev.color || '#f7c6c6' }}>
            {ev.title}
          </div>
        ))}
        {events.length > 3 && <div className="text-xs text-blue-500">view more</div>}
      </div>
    </div>
  );
}
