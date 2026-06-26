'use client';

import { api } from '@/lib/api';
import type { Event } from '@/lib/types';
import { Calendar, MapPin, Pencil, Plus, Trash2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type EventStatus = 'upcoming' | 'completed' | 'cancelled';

const STATUS_STYLES: Record<EventStatus, string> = {
  upcoming: 'bg-blue-500/10 text-blue-400',
  completed: 'bg-green-500/10 text-green-400',
  cancelled: 'bg-red-500/10 text-red-400',
};

const EMPTY_FORM = { title: '', description: '', date: '', location: '', clientName: '', clientEmail: '', status: 'upcoming' as EventStatus };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PhotographerEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<{ events: Event[] }>('/api/events')
      .then(({ events }) => setEvents(events))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  }

  function openEdit(ev: Event) {
    setEditing(ev);
    setForm({
      title: ev.title,
      description: ev.description,
      date: ev.date.slice(0, 16), // datetime-local format
      location: ev.location,
      clientName: ev.clientName,
      clientEmail: ev.clientEmail,
      status: ev.status,
    });
    setError('');
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.date) { setError('Date is required.'); return; }
    setSaving(true);
    setError('');
    try {
      if (editing) {
        const { event } = await api.patch<{ event: Event }>(`/api/events/${editing.id}`, form);
        setEvents(prev => prev.map(e => e.id === editing.id ? event : e));
      } else {
        const { event } = await api.post<{ event: Event }>('/api/events', form);
        setEvents(prev => [event, ...prev]);
      }
      setShowModal(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await api.del(`/api/events/${id}`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch {}
    finally { setDeleting(null); }
  }

  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <p className="text-white/50 text-sm mt-1">Manage bookings and upcoming shoots.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
        >
          <Plus className="w-4 h-4" />New Event
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
          <Calendar className="w-14 h-14 text-white/20 mb-4" />
          <p className="text-white/50 font-semibold text-lg">No events scheduled</p>
          <p className="text-white/30 text-sm mt-2">Your upcoming events and bookings will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(ev => (
            <div key={ev.id} className="glass-effect rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center shrink-0 border border-white/10">
                <span className="text-xs text-white/40 uppercase leading-none">
                  {new Date(ev.date).toLocaleString('en', { month: 'short' })}
                </span>
                <span className="text-white font-bold text-lg leading-none">
                  {new Date(ev.date).getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-semibold text-sm">{ev.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[ev.status]}`}>
                    {ev.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {ev.clientName && (
                    <span className="flex items-center gap-1.5 text-white/40 text-xs">
                      <User className="w-3 h-3" />{ev.clientName}
                    </span>
                  )}
                  {ev.location && (
                    <span className="flex items-center gap-1.5 text-white/40 text-xs">
                      <MapPin className="w-3 h-3" />{ev.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-white/30 text-xs">
                    <Calendar className="w-3 h-3" />{formatDate(ev.date)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(ev)} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(ev.id)}
                  disabled={deleting === ev.id}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                >
                  {deleting === ev.id
                    ? <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                    : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-effect rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">{editing ? 'Edit Event' : 'New Event'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {([
                { label: 'Title *', key: 'title', type: 'text', placeholder: 'Wedding, Portrait Session…' },
                { label: 'Date & Time *', key: 'date', type: 'datetime-local', placeholder: '' },
                { label: 'Client Name', key: 'clientName', type: 'text', placeholder: 'John Doe' },
                { label: 'Client Email', key: 'clientEmail', type: 'email', placeholder: 'client@example.com' },
                { label: 'Location', key: 'location', type: 'text', placeholder: 'Venue or address' },
              ] as const).map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-white/50 text-xs mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                  />
                </div>
              ))}

              <div>
                <label className="text-white/50 text-xs mb-1 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional notes…"
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 resize-none"
                />
              </div>

              <div>
                <label className="text-white/50 text-xs mb-1 block">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as EventStatus }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-white/30"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
            >
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
