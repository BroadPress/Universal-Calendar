const typeColors = {
  Holiday: '#f87171',             // backend "Holiday" - Red
  "Nepali Festivals": '#34d399',  // backend "Nepali Festivals" - Green
  "International Days": '#93c5fd',// backend "International Days" - Light Blue
  "National Days": '#60a5fa',     // backend "National Days" - Blue
  Birthday: '#fbbf24',            // backend "Birthday" - Yellow
  Anniversaries: '#a78bfa',       // backend "Anniversaries" - Purple
  default: '#d1d5db'              // fallback color - Gray
};

const DayCell = ({ cell, events, onOpenEvent }) => {
  if (!cell) return <div className="h-28"></div>;

  return (
    <div className="min-h-28 p-3 bg-transparent rounded">
      <div className="text-xs text-gray-400 mb-2">{cell.day}</div>
      <div className="space-y-2">
        {events.slice(0, 3).map((ev) => (
          <div
            key={ev._id || ev.id}
            className="text-xs px-2 py-1 rounded text-white cursor-pointer"
            style={{ backgroundColor: typeColors[ev.eventType] || typeColors.default }}
            onClick={() => onOpenEvent(ev)}
          >
            {ev.title}
          </div>
        ))}
        {events.length > 3 && (
          <div
            className="text-xs text-blue-500 cursor-pointer"
            onClick={() => onOpenEvent({ showAll: true, date: cell.date })}
          >
            view more
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCell;
