'use client';

import { api } from '@/lib/api';
import type { Album } from '@/lib/types';
import { Copy, ExternalLink, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PhotographerQRCodes() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ albums: Album[] }>('/api/albums')
      .then(({ albums }) => setAlbums(albums))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async (albumId: string) => {
    setGenerating(albumId);
    try {
      const { qrUrl } = await api.post<{ qrUrl: string; token: string }>('/api/qr/generate', { albumId });
      setAlbums(prev => prev.map(a => a.id === albumId
        ? { ...a, qrCode: { ...a.qrCode!, qrUrl, scans: 0, createdAt: new Date().toISOString() } }
        : a));
    } catch {}
    finally { setGenerating(null); }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const albumsWithQR = albums.filter(a => a.qrCode);
  const albumsWithoutQR = albums.filter(a => !a.qrCode);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">QR Codes</h1>
        <p className="text-white/50 text-sm mt-1">Generate QR codes for album access.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : albums.length === 0 ? (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
          <QrCode className="w-14 h-14 text-white/20 mb-4" />
          <p className="text-white/50 font-semibold text-lg">No albums yet</p>
          <p className="text-white/30 text-sm mt-2">Create an album first, then generate a QR code for it.</p>
        </div>
      ) : (
        <>
          {albumsWithQR.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-white/60 text-sm font-medium uppercase tracking-wider">Active QR Codes</h2>
              {albumsWithQR.map(album => (
                <div key={album.id} className="glass-effect rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-white/10 shrink-0">
                      <QrCode className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{album.title}</p>
                      <p className="text-white/40 text-xs">{album.qrCode!.scans} scans</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => copyUrl(album.qrCode!.qrUrl, album.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/70 border border-white/10 hover:bg-white/10 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                      {copied === album.id ? 'Copied!' : 'Copy URL'}
                    </button>
                    <a href={album.qrCode!.qrUrl} target="_blank" rel="noreferrer"
                      className="p-1.5 rounded-lg text-white/50 border border-white/10 hover:bg-white/10 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {albumsWithoutQR.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-white/60 text-sm font-medium uppercase tracking-wider">Generate QR for Album</h2>
              {albumsWithoutQR.map(album => (
                <div key={album.id} className="glass-effect rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">{album.title}</p>
                    <p className="text-white/40 text-xs">{album.photoCount} photos</p>
                  </div>
                  <button onClick={() => handleGenerate(album.id)} disabled={generating === album.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white shrink-0 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}>
                    <QrCode className="w-4 h-4" />
                    {generating === album.id ? 'Generating...' : 'Generate QR'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
