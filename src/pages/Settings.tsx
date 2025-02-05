import React from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-emerald-600 dark:text-emerald-400" size={20} />
                <span className="text-gray-700 dark:text-gray-300">Daily Reminders</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200 mb-4">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="text-emerald-600 dark:text-emerald-400" size={20} />
                ) : (
                  <Sun className="text-emerald-600 dark:text-emerald-400" size={20} />
                )}
                <span className="text-gray-700 dark:text-gray-300">Theme</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1 rounded-md ${
                    theme === 'light'
                      ? 'bg-emerald-100 dark:bg-emerald-600 text-emerald-600 dark:text-white'
                      : 'hover:bg-emerald-50 dark:hover:bg-emerald-700/50'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1 rounded-md ${
                    theme === 'dark'
                      ? 'bg-emerald-100 dark:bg-emerald-600 text-emerald-600 dark:text-white'
                      : 'hover:bg-emerald-50 dark:hover:bg-emerald-700/50'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;