'use client';

import { Building2 } from 'lucide-react';

export default function AdminStudios() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Studios</h1>
        <p className="text-white/50 text-sm mt-1">View and manage all studios on the platform.</p>
      </div>
      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <Building2 className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">No studios yet</p>
        <p className="text-white/30 text-sm mt-2">Studios will appear here once registered.</p>
      </div>
    </div>
  );
}
