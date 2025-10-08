import React from 'react';

export default function Sidebar({ selectedDate }) {
  return (
    <aside className="w-72 p-10 border-r border-gray-300">
      <div className="left-date">
        <div className="big-num">{selectedDate ? new Date(selectedDate).getDate() : '27'}</div>
        <div className="weekday text-2xl mt-2">THURSDAY</div>
      </div>

      <div className="mt-10">
        <h4 className="font-semibold">All Calendar</h4>
        <ul className="mt-4 space-y-3">
          {['Holidays','Festivals','International Days','National Days','Birthdays','Anniversaries','Events','Others'].map((x) =>
            <li key={x} className="flex items-center gap-3">
              <input type="checkbox" />
              <span className="text-sm text-gray-700">{x}</span>
            </li>
          )}
        </ul>
      </div>

      <div className="mt-8 border-t pt-6">
        <h5 className="text-sm text-gray-500">Today's Attraction</h5>
        <div className="mt-4 p-4 border rounded bg-white">
          <div className="text-xs text-gray-400">21 September 2025</div>
          <div className="mt-3 font-medium">International Wildlife Photographer’s Day</div>
        </div>
      </div>
    </aside>
  );
}
