'use client';

import { UserPlus, Users } from 'lucide-react';

export default function PhotographerCustomers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-white/50 text-sm mt-1">Manage your client relationships.</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
        >
          <UserPlus className="w-4 h-4" />Invite Customer
        </button>
      </div>
      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <Users className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">No customers yet</p>
        <p className="text-white/30 text-sm mt-2">Invite customers to access their albums.</p>
      </div>
    </div>
  );
}
