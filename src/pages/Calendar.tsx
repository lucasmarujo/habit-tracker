import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHabits } from '../contexts/HabitsContext';

function Calendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const { habits } = useHabits();

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const shouldShowHabit = (habit: any, date: Date): boolean => {
    const habitStartDate = new Date(habit.date);
    const dayName = getDayName(date);
    
    // Check if the date is after or equal to the habit start date
    // AND if the day is included in the habit's days of week
    return date >= habitStartDate && habit.daysOfWeek.includes(dayName);
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100 dark:border-gray-700"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDayDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      const isToday = 
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      // Filter habits that should appear on this day
      const dayHabits = habits
        .filter(habit => shouldShowHabit(habit, currentDayDate))
        .map(habit => ({
          ...habit,
          isCompleted: habit.completedToday === habit.timesPerDay
        }));

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-100 dark:border-gray-700 p-2 ${
            isToday ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
          }`}
        >
          <span className={`inline-block w-6 h-6 text-center ${
            isToday
              ? 'bg-emerald-600 dark:bg-emerald-500 text-white rounded-full'
              : 'text-gray-900 dark:text-gray-200'
          }`}>
            {day}
          </span>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
            {dayHabits.map(habit => (
              <div
                key={habit.id}
                className="text-xs px-2 py-1 rounded-md truncate"
                style={{ 
                  backgroundColor: `${habit.color}15`,
                  color: habit.color
                }}
                title={`${habit.name} (${habit.completedToday}/${habit.timesPerDay})`}
              >
                {habit.name}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">Calendar</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-emerald-600 dark:text-emerald-400" />
          </button>
          
          <h2 className="text-xl font-semibold text-emerald-900 dark:text-emerald-200">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full transition-colors"
          >
            <ChevronRight size={24} className="text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-600 dark:text-white py-2">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
}

export default Calendar;