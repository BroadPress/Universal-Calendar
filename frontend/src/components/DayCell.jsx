import dayjs from 'dayjs';

const typeColors = {
  Holiday: '#f87171',
  "Nepali Festivals": '#93c5fd',
  "International Days": '#34d399',
  "National Days": '#60a5fa',
  Birthday: '#fbbf24',
  Anniversaries: '#a78bfa',
  default: '#d1d5db'
};

const DayCell = ({ cell, events, onOpenEvent }) => {
  if (!cell)
    return (
      <div className="aspect-square border-r border-b border-gray-300 bg-gray-50"></div>
    );

  const isToday = dayjs(cell.date).isSame(dayjs(), 'day');

  return (
    <div
      className={`aspect-square p-3 flex flex-col items-start justify-start border-r border-b border-gray-300 bg-white hover:bg-gray-50 transition-all duration-150`}
    >
      {/* Day number */}
      <div
        className={`mb-2 flex items-center justify-center w-8 h-8 rounded-full text-lg font-semibold ${isToday ? 'bg-black text-white shadow-md' : 'text-gray-500'
          }`}
      >
        {cell.day}
      </div>

      {/* Events */}
      <div className="flex flex-col gap-1 w-full overflow-hidden">
        {events.slice(0, 3).map((ev) => (
          <div
            key={ev._id || ev.id}
            className="text-xs px-2 py-1 rounded-full text-white font-medium text-center truncate cursor-pointer shadow-sm"
            style={{
              backgroundColor: typeColors[ev.eventType] || typeColors.default,
            }}
            onClick={() => onOpenEvent(ev)}
            title={ev.title}
          >
            {ev.title}
          </div>
        ))}

        {events.length > 3 && (
          <div
            className="text-xs text-blue-600 font-medium cursor-pointer truncate"
            onClick={() => onOpenEvent({ showAll: true, date: cell.date })}
          >
            +{events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCell;
