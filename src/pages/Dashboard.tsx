import React, { useState } from 'react';
import { BarChart, Activity, Clock, Plus, Check, X, Trophy, Trash2 } from 'lucide-react';
import { useHabits } from '../contexts/HabitsContext';

function Dashboard() {
  const { habits, addHabit, toggleHabit, removeHabit, clearAllHabits } = useHabits();
  const [showHabitForm, setShowHabitForm] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [newHabit, setNewHabit] = useState({
    name: "",
    timesPerDay: 1,
    color: "#10B981",
    period: "morning" as const,
    date: today,
    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  });

  // Filter habits by completion status
  const pendingHabits = habits.filter(h => h.completedToday < h.timesPerDay);
  const completedHabits = habits.filter(h => h.completedToday === h.timesPerDay);

  // Calculate statistics
  const totalHabits = habits.length;
  const completionRate = habits.length > 0
    ? Math.round((completedHabits.length / habits.length) * 100)
    : 0;
  const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDaySelection = (day: string) => {
    setNewHabit(prev => {
      const currentDays = prev.daysOfWeek || [];
      const updatedDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];
      return { ...prev, daysOfWeek: updatedDays };
    });
  };

  const handleAddHabit = async () => {
    if (newHabit.name.trim()) {
      try {
        await addHabit(newHabit);
        setNewHabit({
          name: "",
          timesPerDay: 1,
          color: "#10B981",
          period: "morning",
          date: today,
          daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        });
        setShowHabitForm(false);
      } catch (error) {
        console.error('Error adding habit:', error);
      }
    }
  };

  // Format today's date
  const formattedDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">Dashboard</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{formattedDate}</p>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">Total Habits</h3>
            <Activity className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{totalHabits}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Active habits this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">Completion Rate</h3>
            <BarChart className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{completionRate}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Today's progress</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">Longest Streak</h3>
            <div className="flex items-center gap-2">
              <Trophy className="text-emerald-600 dark:text-emerald-400" size={24} />
              <button
                onClick={clearAllHabits}
                className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Clear all habits"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{longestStreak} days</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Current record</p>
        </div>
      </div>

      {/* Pending Tasks Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="text-emerald-600 dark:text-emerald-400" size={24} />
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">Pending Tasks</h3>
          </div>
          <button
            onClick={() => setShowHabitForm(!showHabitForm)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>New Habit</span>
          </button>
        </div>

        {showHabitForm && (
          <div className="mb-6 bg-emerald-50 dark:bg-gray-700/50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200 mb-4">Create New Habit</h4>
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newHabit.date}
                    min={today}
                    onChange={(e) => setNewHabit({ ...newHabit, date: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-gray-900 dark:text-gray-100 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repeat on Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDaySelection(day)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        newHabit.daysOfWeek.includes(day)
                          ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowHabitForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddHabit}
                  className="px-4 py-2 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  Create Habit
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {pendingHabits.map(habit => (
            <div
              key={habit.id}
              className="flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md"
              style={{ 
                backgroundColor: `${habit.color}15`,
                borderLeft: `4px solid ${habit.color}`
              }}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-emerald-900 dark:text-emerald-200">{habit.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(habit.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm text-emerald-600 dark:text-emerald-400">{habit.streak} day streak</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-white/50 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${(habit.completedToday / habit.timesPerDay) * 100}%`,
                          backgroundColor: habit.color
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Progress: {habit.completedToday}/{habit.timesPerDay} times today
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-colors"
                      style={{ backgroundColor: habit.color }}
                      title="Complete habit"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => removeHabit(habit.id)}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      title="Remove habit"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {pendingHabits.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No pending tasks. Great job!
            </div>
          )}
        </div>
      </div>

      {/* Completed Tasks Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-6 transition-colors">
        <div className="flex items-center gap-2 mb-6">
          <Check className="text-emerald-600 dark:text-emerald-400" size={24} />
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">Completed Tasks</h3>
        </div>

        <div className="space-y-4">
          {completedHabits.map(habit => (
            <div
              key={habit.id}
              className="flex items-center justify-between p-4 rounded-lg transition-all"
              style={{ 
                backgroundColor: `${habit.color}15`,
                borderLeft: `4px solid ${habit.color}`
              }}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-emerald-900 dark:text-emerald-200">{habit.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(habit.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm text-emerald-600 dark:text-emerald-400">{habit.streak} day streak</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-emerald-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all bg-emerald-600 dark:bg-emerald-500"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Completed: {habit.timesPerDay}/{habit.timesPerDay} times today
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      title="Undo completion"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => removeHabit(habit.id)}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      title="Remove habit"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {completedHabits.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No completed tasks yet. Keep going!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;