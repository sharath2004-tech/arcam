'use client';

import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export default function CustomerSettings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/50 text-sm mt-1">Manage your profile and preferences.</p>
      </div>

      <div className="glass-effect rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-white">Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/50 mb-1">Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Email</label>
            <input
              value={user?.email ?? ''}
              disabled
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/40 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Phone</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50"
              placeholder="+91 00000 00000"
            />
          </div>
        </div>
        <button
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
          style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
        >
          Save Changes
        </button>
      </div>

      <div className="glass-effect rounded-2xl p-6 space-y-3">
        <h2 className="font-semibold text-white">Security</h2>
        <button className="text-sm text-primary hover:underline">Change Password</button>
      </div>
    </div>
  );
}
