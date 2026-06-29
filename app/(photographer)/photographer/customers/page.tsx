'use client';

import { api } from '@/lib/api';
import type { Album, Customer } from '@/lib/types';
import { Folders, Mail, Trash2, UserPlus, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const EMPTY_FORM = { email: '', albumIds: [] as string[] };

export default function PhotographerCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<{ customers: Customer[] }>('/api/customers'),
      api.get<{ albums: Album[] }>('/api/albums'),
    ])
      .then(([c, a]) => {
        setCustomers(c.customers);
        setAlbums(a.albums);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function openInvite() {
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  }

  function toggleAlbum(albumId: string) {
    setForm(prev => ({
      ...prev,
      albumIds: prev.albumIds.includes(albumId)
        ? prev.albumIds.filter(id => id !== albumId)
        : [...prev.albumIds, albumId],
    }));
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email.trim()) { setError('Email is required'); return; }
    setSaving(true);
    setError('');
    try {
      const { customer } = await api.post<{ customer: Customer; message: string }>('/api/customers/invite', {
        email: form.email.trim(),
        albumIds: form.albumIds.length > 0 ? form.albumIds : undefined,
      });
      setCustomers(prev => {
        const exists = prev.find(c => c.id === customer.id);
        if (exists) {
          const merged = { ...exists, albums: [...exists.albums, ...customer.albums.filter(a => !exists.albums.find(ea => ea.albumId === a.albumId))] };
          return prev.map(c => c.id === customer.id ? merged : c);
        }
        return [...prev, customer];
      });
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to invite customer');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(customerId: string) {
    setRemoving(customerId);
    try {
      await api.del(`/api/customers/${customerId}`);
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    } catch {}
    finally { setRemoving(null); }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-white/50 text-sm mt-1">Manage clients who have access to your albums.</p>
        </div>
        <button
          onClick={openInvite}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
        >
          <UserPlus className="w-4 h-4" />Invite Customer
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : customers.length === 0 ? (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
          <Users className="w-14 h-14 text-white/20 mb-4" />
          <p className="text-white/50 font-semibold text-lg">No customers yet</p>
          <p className="text-white/30 text-sm mt-2">Invite customers to give them access to your albums.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map(customer => (
            <div key={customer.id} className="glass-effect rounded-2xl p-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold text-sm uppercase overflow-hidden">
                {customer.avatar
                  ? <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                  : customer.name.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{customer.name}</p>
                <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3" />{customer.email}
                </p>
                {customer.albums.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {customer.albums.slice(0, 3).map(a => (
                      <span key={a.albumId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs bg-white/5 text-white/50">
                        <Folders className="w-3 h-3" />{a.albumTitle}
                      </span>
                    ))}
                    {customer.albums.length > 3 && (
                      <span className="text-xs text-white/30 self-center">+{customer.albums.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>

              {/* Remove */}
              <button
                onClick={() => handleRemove(customer.id)}
                disabled={removing === customer.id}
                className="p-2 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40"
                title="Remove access"
              >
                {removing === customer.id
                  ? <div className="w-4 h-4 border-2 border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                  : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-effect rounded-2xl p-6 w-full max-w-md space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Invite Customer</h2>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-white/70 text-sm font-medium block mb-1.5">Customer Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="customer@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-primary/50"
                  autoFocus
                />
                <p className="text-white/30 text-xs mt-1.5">The customer must already have an AR Memories account.</p>
              </div>

              {albums.length > 0 && (
                <div>
                  <label className="text-white/70 text-sm font-medium block mb-1.5">
                    Albums to share{' '}
                    <span className="text-white/30 font-normal">(leave all unchecked to share all albums)</span>
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {albums.map(album => (
                      <label key={album.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={form.albumIds.includes(album.id)}
                          onChange={() => toggleAlbum(album.id)}
                          className="w-4 h-4 rounded accent-primary"
                        />
                        <span className="text-white/70 text-sm">{album.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 border border-white/10 hover:border-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
                >
                  {saving ? 'Inviting…' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
