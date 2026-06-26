'use client';

import { api } from '@/lib/api';
import type { Album } from '@/lib/types';
import { Folders, Globe, Lock, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PhotographerAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<{ albums: Album[] }>('/api/albums')
      .then(({ albums }) => setAlbums(albums))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true); setError('');
    try {
      const { album } = await api.post<{ album: Album }>('/api/albums', { title, description, isPublic });
      setAlbums(prev => [album, ...prev]);
      setTitle(''); setDescription(''); setIsPublic(false); setShowCreate(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create album');
    } finally { setCreating(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this album?')) return;
    try {
      await api.delete(`/api/albums/${id}`);
      setAlbums(prev => prev.filter(a => a.id !== id));
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Albums</h1>
          <p className="text-white/50 text-sm mt-1">Create and manage your photo albums.</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}>
          <Plus className="w-4 h-4" />New Album
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="glass-effect rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg">New Album</h2>
              <button onClick={() => setShowCreate(false)}><X className="w-5 h-5 text-white/50" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div>
                <label className="block text-white/50 text-sm mb-1">Title *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Wedding, Graduation..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="block text-white/50 text-sm mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 resize-none" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer" onClick={() => setIsPublic(p => !p)}>
                <div className={`w-10 h-6 rounded-full transition-colors ${isPublic ? 'bg-green-500' : 'bg-white/20'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white m-0.5 transition-transform ${isPublic ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-white/70 text-sm">Public (accessible via QR without login)</span>
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm text-white/60 border border-white/10">Cancel</button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}>
                  {creating ? 'Creating...' : 'Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : albums.length === 0 ? (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
          <Folders className="w-14 h-14 text-white/20 mb-4" />
          <p className="text-white/50 font-semibold text-lg">No albums yet</p>
          <p className="text-white/30 text-sm mt-2">Create your first album to start sharing memories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map(album => (
            <div key={album.id} className="glass-effect rounded-2xl overflow-hidden group">
              <div className="h-36 bg-white/5 flex items-center justify-center">
                {album.coverUrl
                  ? <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
                  : <Folders className="w-10 h-10 text-white/20" />}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white font-semibold text-sm line-clamp-1">{album.title}</h3>
                  <button onClick={() => handleDelete(album.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 text-white/40 text-xs">
                  {album.isPublic
                    ? <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Public</span>
                    : <span className="flex items-center gap-1"><Lock className="w-3 h-3" />Private</span>}
                  <span>{album.photoCount} photo{album.photoCount !== 1 ? 's' : ''}</span>
                  <span>{album.totalViews} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
