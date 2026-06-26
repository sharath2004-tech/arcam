'use client';

import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export default function StudioSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [studioName, setStudioName] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call PUT /api/auth/me
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/50 text-sm mt-1">Manage your studio profile and account settings.</p>
      </div>
      <div className="glass-effect rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-white/50 text-sm mb-1">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="block text-white/50 text-sm mb-1">Email</label>
            <input value={user?.email ?? ''} disabled
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/40 text-sm outline-none cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-white/50 text-sm mb-1">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="block text-white/50 text-sm mb-1">Studio Name</label>
            <input value={studioName} onChange={e => setStudioName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30" />
          </div>
          <button type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}>
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
