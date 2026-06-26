'use client';

import { Bell } from 'lucide-react';

export default function CustomerNotifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <p className="text-white/50 text-sm mt-1">Stay updated on your albums and activity.</p>
      </div>
      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <Bell className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">No notifications</p>
        <p className="text-white/30 text-sm mt-2">You're all caught up! New notifications will appear here.</p>
      </div>
    </div>
  );
}
