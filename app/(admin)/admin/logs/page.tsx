'use client';

import { ScrollText } from 'lucide-react';

export default function AdminLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
        <p className="text-white/50 text-sm mt-1">Track all admin actions and system events.</p>
      </div>
      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <ScrollText className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">No log entries yet</p>
        <p className="text-white/30 text-sm mt-2">Admin actions and events will be recorded here.</p>
      </div>
    </div>
  );
}
