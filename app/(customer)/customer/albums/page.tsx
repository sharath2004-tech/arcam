'use client';

import { api } from '@/lib/api';
import type { Album } from '@/lib/types';
import { Folders, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CustomerAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get<{ albums: Album[] }>('/api/albums')
      .then(({ albums }) => setAlbums(albums))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = albums.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Albums</h1>
        <p className="text-white/50 text-sm mt-1">Albums shared with you.</p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search albums..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none focus:border-white/30 placeholder:text-white/30" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
          <Folders className="w-14 h-14 text-white/20 mb-4" />
          <p className="text-white/50 font-semibold text-lg">{search ? 'No matching albums' : 'No albums yet'}</p>
          <p className="text-white/30 text-sm mt-2">
            {search ? 'Try a different search term.' : 'Albums shared with you will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(album => (
            <Link key={album.id} href={`/customer/albums/${album.id}`} className="glass-effect rounded-2xl overflow-hidden hover:bg-white/5 transition-colors block">
              <div className="h-36 bg-white/5 flex items-center justify-center">
                {album.coverUrl
                  ? <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
                  : <Folders className="w-10 h-10 text-white/20" />}
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm">{album.title}</h3>
                <p className="text-white/40 text-xs mt-1">{album.photoCount} photo{album.photoCount !== 1 ? 's' : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
