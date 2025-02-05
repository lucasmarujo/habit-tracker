import React, { useState } from 'react';
import { Plus, Check, X, Trophy } from 'lucide-react';
import { useHabits } from '../contexts/HabitsContext';

function Habits() {
  const { habits, addHabit, toggleHabit, removeHabit } = useHabits();
  const [newHabit, setNewHabit] = useState({
    name: "",
    timesPerDay: 1,
    color: "#10B981",
    period: "morning" as const
  });

  const handleAddHabit = () => {
    if (newHabit.name.trim()) {
      addHabit(newHabit);
      setNewHabit({
        name: "",
        timesPerDay: 1,
        color: "#10B981",
        period: "morning"
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">Habits</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-6 mb-6 transition-colors">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200 mb-4">Create New Habit</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Habit Name
            </label>
            <input
              type="text"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              placeholder="Enter a new habit..."
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Times per Day
            </label>
            <input
              type="number"
              min="1"
              value={newHabit.timesPerDay}
              onChange={(e) => setNewHabit({ ...newHabit, timesPerDay: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-gray-900 dark:text-gray-100 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color
            </label>
            <input
              type="color"
              value={newHabit.color}
              onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })}
              className="w-full h-10 p-1 rounded-lg border border-emerald-200 dark:border-gray-600 bg-white dark:bg-gray-700 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Period
            </label>
            <select
              value={newHabit.period}
              onChange={(e) => setNewHabit({ ...newHabit, period: e.target.value as 'morning' | 'afternoon' | 'night' })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-gray-900 dark:text-gray-100 transition-colors"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="night">Night</option>
            </select>
          </div>

          <button
            onClick={handleAddHabit}
            className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Habit
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {habits.map(habit => (
          <div
            key={habit.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-4 transition-all hover:shadow-lg"
            style={{ borderLeft: `4px solid ${habit.color}` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">
                  {habit.name}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{habit.streak} day streak</span>
                  </div>
                  <div>
                    {habit.timesPerDay}x per day • {habit.period}
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-2 w-full h-2 bg-emerald-100 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${(habit.completedToday / habit.timesPerDay) * 100}%`,
                      backgroundColor: habit.color
                    }}
                  />
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Progress: {habit.completedToday}/{habit.timesPerDay} times today
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    habit.completedToday === habit.timesPerDay
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'text-white hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: habit.completedToday === habit.timesPerDay ? '#ecfdf5' : habit.color
                  }}
                  title="Complete habit"
                >
                  <Check size={24} />
                </button>
                <button
                  onClick={() => removeHabit(habit.id)}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  title="Remove habit"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {habits.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No habits added yet. Add your first habit above!
          </div>
        )}
      </div>
    </div>
  );
}

export default Habits;