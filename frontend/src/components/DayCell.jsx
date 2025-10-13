import dayjs from 'dayjs';

const typeColors = {
  Holiday: '#f87171',             // backend "Holiday" - Red
  "Nepali Festivals": '#93c5fd' ,  // backend "Nepali Festivals" - Green
  "International Days": '#34d399',// backend "International Days" - Light Blue
  "National Days": '#60a5fa',     // backend "National Days" - Blue
  Birthday: '#fbbf24',            // backend "Birthday" - Yellow
  Anniversaries: '#a78bfa',       // backend "Anniversaries" - Purple
  default: '#d1d5db'              // fallback color - Gray
};

const DayCell = ({ cell, events, onOpenEvent }) => {
  if (!cell) return <div className="h-28"></div>;

  const isToday = dayjs(cell.date).isSame(dayjs(), 'day'); // check if current date

  return (
    <div className="min-h-28 p-3 bg-transparent rounded flex flex-col items-center justify-center">
      {/* Day number */}
      <div
        className={`text-xs mb-2 flex items-center justify-center w-6 h-6 rounded-full ${
          isToday ? 'bg-black text-white' : 'text-gray-400'
        }`}
      >
        {cell.day}
      </div>

      {/* Events */}
      <div className="space-y-2 w-full">
        {events.slice(0, 3).map((ev) => (
          <div
            key={ev._id || ev.id}
            className="text-xs px-2 py-1 rounded text-white text-center cursor-pointer"
            style={{ backgroundColor: typeColors[ev.eventType] || typeColors.default }}
            onClick={() => onOpenEvent(ev)}
          >
            {ev.title}
          </div>
        ))}

        {events.length > 3 && (
          <div
            className="text-xs text-blue-500 text-center cursor-pointer"
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
