'use client';

import { Button } from '@/components/ui/button-glass';
import { Folders, Mail, Trash2, UserPlus, Users, X } from 'lucide-react';
import { useState } from 'react';

interface CustomerAlbumRef {
  albumId: string;
  albumTitle: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  albums: CustomerAlbumRef[];
}

interface MockAlbum {
  id: string;
  title: string;
}

const MOCK_ALBUMS: MockAlbum[] = [
  { id: '1', title: 'Summer 2024' },
  { id: '2', title: 'Wedding Day' },
  { id: '3', title: 'Family Gathering' },
];

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    avatar: null,
    albums: [
      { albumId: '1', albumTitle: 'Summer 2024' },
      { albumId: '2', albumTitle: 'Wedding Day' },
    ],
  },
  {
    id: '2',
    name: 'Rohan Mehta',
    email: 'rohan@example.com',
    avatar: null,
    albums: [{ albumId: '3', albumTitle: 'Family Gathering' }],
  },
];

const EMPTY_FORM = { email: '', albumIds: [] as string[] };

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState('');

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
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));

    const selectedAlbums = form.albumIds.length > 0
      ? MOCK_ALBUMS.filter(a => form.albumIds.includes(a.id)).map(a => ({ albumId: a.id, albumTitle: a.title }))
      : MOCK_ALBUMS.map(a => ({ albumId: a.id, albumTitle: a.title }));

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: form.email.split('@')[0],
      email: form.email.trim(),
      avatar: null,
      albums: selectedAlbums,
    };
    setCustomers(prev => [...prev, newCustomer]);
    setSaving(false);
    setShowModal(false);
  }

  async function handleRemove(customerId: string) {
    setRemoving(customerId);
    await new Promise(r => setTimeout(r, 500));
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    setRemoving(null);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Customers</h1>
          <p className="text-muted-foreground">Manage clients who have access to your albums.</p>
        </div>
        <Button onClick={openInvite} className="gap-2">
          <UserPlus className="w-5 h-5" />
          Invite Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="glass-effect rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-foreground font-semibold">{customers.length} customers</p>
          <p className="text-muted-foreground text-sm">have access to your albums</p>
        </div>
      </div>

      {/* List */}
      {customers.length === 0 ? (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
          <Users className="w-14 h-14 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-semibold text-lg">No customers yet</p>
          <p className="text-muted-foreground/60 text-sm mt-2">Invite customers to give them access to your albums.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map(customer => (
            <div key={customer.id} className="glass-effect rounded-2xl p-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold uppercase overflow-hidden">
                {customer.avatar
                  ? <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                  : customer.name.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{customer.name}</p>
                <p className="text-muted-foreground text-sm flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />{customer.email}
                </p>
                {customer.albums.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {customer.albums.slice(0, 3).map(a => (
                      <span key={a.albumId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs bg-primary/10 text-primary/80">
                        <Folders className="w-3 h-3" />{a.albumTitle}
                      </span>
                    ))}
                    {customer.albums.length > 3 && (
                      <span className="text-xs text-muted-foreground self-center">+{customer.albums.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>

              {/* Remove */}
              <button
                onClick={() => handleRemove(customer.id)}
                disabled={removing === customer.id}
                className="p-2 rounded-xl text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
                title="Remove access"
              >
                {removing === customer.id
                  ? <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
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
              <h2 className="text-lg font-bold text-foreground">Invite Customer</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-foreground/70 text-sm font-medium block mb-1.5">Customer Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="customer@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50"
                  autoFocus
                />
                <p className="text-muted-foreground text-xs mt-1.5">The customer must already have an AR Memories account.</p>
              </div>

              <div>
                <label className="text-foreground/70 text-sm font-medium block mb-1.5">
                  Albums to share{' '}
                  <span className="text-muted-foreground font-normal">(leave all unchecked to share all)</span>
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {MOCK_ALBUMS.map(album => (
                    <label key={album.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={form.albumIds.includes(album.id)}
                        onChange={() => toggleAlbum(album.id)}
                        className="w-4 h-4 rounded accent-primary"
                      />
                      <span className="text-foreground/70 text-sm">{album.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? 'Inviting…' : 'Send Invite'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
