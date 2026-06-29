'use client';

import type { Album } from '@/lib/types';
import { Camera, Folders, Image } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

export default function ScanClient() {
  const { token } = useParams<{ token: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${BASE_URL}/api/qr/scan/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) setAlbum(data.album);
        else setError(data.message || 'QR code not found or expired.');
      })
      .catch(() => setError('Failed to load album. Please try again.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="glass-effect rounded-3xl p-10 max-w-sm w-full space-y-4">
          <Folders className="w-12 h-12 text-white/20 mx-auto" />
          <p className="text-white font-semibold text-lg">Album not found</p>
          <p className="text-white/40 text-sm">{error}</p>
          <Link href="/" className="block text-primary text-sm mt-2 hover:underline">
            Go to AR Memories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="pt-8">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">AR Memories</p>
        <h1 className="text-2xl font-bold text-white">{album.title}</h1>
        {album.description && (
          <p className="text-white/50 text-sm mt-1">{album.description}</p>
        )}
        <p className="text-white/30 text-xs mt-2">{album.photoCount} photo{album.photoCount !== 1 ? 's' : ''}</p>
      </div>

      {/* Cover */}
      {album.coverUrl && (
        <div className="rounded-2xl overflow-hidden h-52">
          <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Photo grid */}
      {album.photos.length > 0 ? (
        <div className="glass-effect rounded-2xl p-4 space-y-3">
          <h2 className="text-white font-semibold text-sm">Photos</h2>
          <div className="grid grid-cols-3 gap-2">
            {album.photos.map((photo, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/5">
                <img src={photo.url} alt={photo.caption || `Photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-effect rounded-2xl p-10 flex flex-col items-center text-center">
          <Image className="w-10 h-10 text-white/20 mb-3" />
          <p className="text-white/40 text-sm">No photos yet</p>
        </div>
      )}

      {/* AR CTA */}
      <div
        className="rounded-2xl p-6 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15 / 0.3), oklch(0.72 0.14 55 / 0.2))' }}
      >
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
          <Camera className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Bring photos to life</p>
          <p className="text-white/40 text-xs mt-0.5">
            Open the AR Memories app and point your camera at any printed photo from this album.
          </p>
        </div>
      </div>

      <Link href="/customer/albums" className="text-center text-white/30 text-xs pb-8 hover:text-white/60 transition-colors">
        Sign in to save this album →
      </Link>
    </div>
  );
}
