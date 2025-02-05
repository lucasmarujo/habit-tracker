import React, { useState } from 'react';
import { Bell } from 'lucide-react';

function NotificationsButton() {
  const [enabled, setEnabled] = useState(false);

  const toggleNotifications = () => {
    setEnabled(!enabled);
    // Here you would handle the actual notification permission request
    // and subscription logic
  };

  return (
    <button
      onClick={toggleNotifications}
      className="fixed bottom-6 right-6 w-12 h-12 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
      title={enabled ? 'Disable notifications' : 'Enable notifications'}
    >
      <Bell size={24} className={enabled ? 'text-white' : 'text-white/90'} />
    </button>
  );
}

export default NotificationsButton;