import React from 'react';

const typeColors = {
  meeting: '#93c5fd',      
  birthday: '#fbbf24',     
  workshop: '#34d399',     
  holiday: '#f87171',      
  personal: '#a78bfa',     
  release: '#f472b6',      
  outing: '#fdba74',       
  hackathon: '#60a5fa',    
  deadline: '#ef4444',     
  default: '#d1d5db'       
};

export default function DayCell({ cell, events, onOpen }) {
  if (!cell) return <div className="h-28"></div>;

  return (
    <div className="min-h-28 p-3 bg-transparent rounded cursor-pointer" onClick={onOpen}>
      <div className="text-xs text-gray-400 mb-2">{cell.day}</div>
      <div className="space-y-2">
        {events.slice(0,3).map((ev) => (
          <div
            key={ev._id || ev.id} // fallback to demo event id
            className="text-xs px-2 py-1 rounded text-black"
            style={{ background: typeColors[ev.type] || typeColors.default }}
          >
            {ev.title}
          </div>
        ))}
        {events.length > 3 && <div className="text-xs text-blue-500">view more</div>}
      </div>
    </div>
  );
}
