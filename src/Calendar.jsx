import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, 
         isSameMonth, isSameDay, addMonths, subMonths, isToday, isFuture } from 'date-fns';

const Dashboard = ({ entries }) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateClick = (date) => {
    navigate(`/entry/${format(date, 'yyyy-MM-dd')}`);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="w-5/6 mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          ◀
        </button>
        <h2 className="text-2xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          disabled={isSameMonth(currentMonth, new Date())}
          className={`p-2 rounded-full ${isSameMonth(currentMonth, new Date()) ? 'text-gray-400' : 'hover:bg-gray-100'}`}
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}

        {monthDays.map(day => {
          const disabled = isFuture(day);
          const hasEntry = entries.some(entry => isSameDay(new Date(entry.date), day));
          
          return (
            <button
              key={day.toString()}
              onClick={() => !disabled && handleDateClick(day)}
              className={`h-12 flex items-center justify-center rounded
                ${hasEntry ? 'bg-orange-200' : 'bg-white'} 
                ${isToday(day) ? 'ring-2 ring-orange-500' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-60'}`}
              disabled={disabled}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;