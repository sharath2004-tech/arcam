'use client';

import { api } from '@/lib/api';
import { Bell, CheckCheck, Folders, Image, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Notification {
  id: string;
  type: 'album_shared' | 'photo_added' | 'qr_scanned' | 'general';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<Notification['type'], React.ElementType> = {
  album_shared: Folders,
  photo_added: Image,
  qr_scanned: QrCode,
  general: Bell,
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    api.get<{ notifications: Notification[] }>('/api/notifications')
      .then(({ notifications }) => setNotifications(notifications))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id: string) {
    await api.patch(`/api/notifications/${id}/read`, {}).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  async function markAllRead() {
    setMarkingAll(true);
    await api.patch('/api/notifications/read-all', {}).catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setMarkingAll(false);
  }

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-white/50 text-sm mt-1">Stay updated on your albums and activity.</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/60 border border-white/10 hover:border-white/20 hover:text-white transition-colors disabled:opacity-40"
          >
            <CheckCheck className="w-4 h-4" />
            {markingAll ? 'Marking…' : 'Mark all read'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
          <Bell className="w-14 h-14 text-white/20 mb-4" />
          <p className="text-white/50 font-semibold text-lg">No notifications</p>
          <p className="text-white/30 text-sm mt-2">You&apos;re all caught up! New notifications will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const Icon = TYPE_ICONS[n.type] ?? Bell;
            return (
              <button
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={[
                  'w-full text-left glass-effect rounded-2xl p-4 flex items-start gap-4 transition-colors',
                  n.read ? 'opacity-60' : 'hover:bg-white/5',
                ].join(' ')}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-white/5' : 'bg-primary/10'}`}>
                  <Icon className={`w-5 h-5 ${n.read ? 'text-white/30' : 'text-primary'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${n.read ? 'text-white/50' : 'text-white'}`}>{n.title}</p>
                    <span className="text-white/30 text-xs shrink-0">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-white/40 text-xs mt-0.5">{n.body}</p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

