'use client';

import { api } from '@/lib/api';
import type { Album } from '@/lib/types';
import { ArrowLeft, ImageIcon, Play, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CustomerAlbumDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    // '_' is the static placeholder from generateStaticParams — never fetch it
    if (!id || id === '_') {
      setLoading(false);
      return;
    }
    api.get<{ album: Album }>(`/api/albums/${id}`)
      .then(({ album }) => setAlbum(album))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Could not load album');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/customer/albums" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />Back to albums
        </Link>
        <div className="glass-effect rounded-2xl p-12 flex flex-col items-center text-center gap-3">
          <ImageIcon className="w-12 h-12 text-white/20" />
          <p className="text-white/50 font-semibold">Could not load album</p>
          <p className="text-white/30 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 rounded-xl text-sm text-white/60 border border-white/10 hover:border-white/20 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!album) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/customer/albums" className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white truncate">{album.title}</h1>
          {album.description && <p className="text-white/50 text-sm mt-0.5">{album.description}</p>}
        </div>
        <span className="text-white/30 text-sm">{album.photoCount} photo{album.photoCount !== 1 ? 's' : ''}</span>
      </div>

      {/* AR hint */}
      {album.photos.some(p => p.videoUrl) && (
        <div className="glass-effect rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="w-4 h-4 text-primary fill-primary" />
          </div>
          <p className="text-white/60 text-sm">
            Photos with an <span className="text-primary font-medium">AR</span> badge have linked videos — tap the badge to watch, or use the AR Camera to play them on a printed photo.
          </p>
        </div>
      )}

      {/* Photo Grid */}
      {album.photos.length === 0 ? (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
          <ImageIcon className="w-14 h-14 text-white/20 mb-4" />
          <p className="text-white/50 font-semibold text-lg">No photos yet</p>
          <p className="text-white/30 text-sm mt-2">The photographer hasn&apos;t added photos to this album yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {album.photos.map((photo) => (
            <div
              key={photo.url}
              className="relative rounded-2xl overflow-hidden aspect-square bg-white/5 cursor-pointer"
              onClick={() => setSelected(photo.url)}
            >
              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />

              {/* AR video badge */}
              {photo.videoUrl && (
                <button
                  onClick={e => { e.stopPropagation(); setPlayingUrl(photo.videoUrl!); }}
                  className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 text-white text-xs backdrop-blur-sm hover:bg-primary/80 transition-colors"
                >
                  <Play className="w-3 h-3 fill-white" />AR
                </button>
              )}

              {/* Caption on hover */}
              {photo.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white/90 text-xs truncate">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelected(null)}
        >
          <button className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
            <X className="w-7 h-7" />
          </button>
          <img
            src={selected}
            alt=""
            className="max-w-full max-h-full rounded-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* Video player */}
      {playingUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setPlayingUrl(null)}
              className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <video
              src={playingUrl}
              controls
              autoPlay
              className="w-full rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
