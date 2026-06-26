'use client';

import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export default function PhotographerSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.put('/api/auth/me', { name, phone, bio, website });
      updateUser({ name, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/50 text-sm mt-1">Manage your photographer profile and preferences.</p>
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
            <label className="block text-white/50 text-sm mb-1">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 resize-none" />
          </div>
          <div>
            <label className="block text-white/50 text-sm mb-1">Website</label>
            <input value={website} onChange={e => setWebsite(e.target.value)} type="url" placeholder="https://"
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
