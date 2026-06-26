'use client';

import { Users } from 'lucide-react';
import { useState } from 'react';

const ROLES = ['All', 'customer', 'photographer', 'studio_manager', 'staff', 'admin', 'super_admin'];

export default function AdminUsers() {
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-white/50 text-sm mt-1">Manage all platform users and roles.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 placeholder:text-white/30"
        />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30"
        >
          {ROLES.map(r => <option key={r} value={r} className="bg-neutral-900">{r}</option>)}
        </select>
      </div>
      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <Users className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">No users found</p>
        <p className="text-white/30 text-sm mt-2">Users will appear here once registered.</p>
      </div>
    </div>
  );
}
