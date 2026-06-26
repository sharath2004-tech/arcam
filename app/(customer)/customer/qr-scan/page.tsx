'use client';

import QRScanner from '@/components/qr-scanner';
import type { Album } from '@/lib/types';
import { CheckCircle, Folders, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

type ScanState = 'idle' | 'scanning' | 'loading' | 'success' | 'error';

export default function CustomerQRScan() {
  const router = useRouter();
  const [state, setState] = useState<ScanState>('idle');
  const [album, setAlbum] = useState<Album | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleResult = useCallback(async (text: string) => {
    setState('loading');
    try {
      // Extract token from URL like https://arcam.vercel.app/scan/<token>
      // or accept a raw token
      const match = text.match(/\/scan\/([a-f0-9]+)$/i) || text.match(/^([a-f0-9]{32})$/i);
      const token = match ? match[1] : null;

      if (!token) {
        setErrorMsg('This QR code is not an AR Memories code.');
        setState('error');
        return;
      }

      const res = await fetch(`${BASE_URL}/api/qr/scan/${token}`);
      const data = await res.json();

      if (data.ok) {
        setAlbum(data.album);
        setState('success');
      } else {
        setErrorMsg(data.message || 'QR code not found or expired.');
        setState('error');
      }
    } catch {
      setErrorMsg('Could not connect to server. Please try again.');
      setState('error');
    }
  }, []);

  const reset = () => {
    setAlbum(null);
    setErrorMsg('');
    setState('idle');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Scan QR</h1>
        <p className="text-white/50 text-sm mt-1">Scan a QR code to access a shared album.</p>
      </div>

      {/* Idle — start scanning */}
      {state === 'idle' && (
        <div className="glass-effect rounded-2xl p-10 flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75V16.5ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75V13.5ZM13.5 19.5h.75v.75h-.75V19.5ZM19.5 13.5h.75v.75h-.75V13.5ZM19.5 19.5h.75v.75h-.75V19.5ZM16.5 16.5h.75v.75h-.75V16.5Z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold">Ready to scan</p>
            <p className="text-white/40 text-sm mt-1">Tap below to open your camera and scan an AR Memories QR code.</p>
          </div>
          <button
            onClick={() => setState('scanning')}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
          >
            Open Camera
          </button>
        </div>
      )}

      {/* Scanning */}
      {state === 'scanning' && (
        <div className="glass-effect rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold text-sm">Scanning…</p>
            <button onClick={reset} className="text-white/40 hover:text-white/60 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <QRScanner onResult={handleResult} onError={() => { setErrorMsg('Camera error. Please try again.'); setState('error'); }} />
        </div>
      )}

      {/* Loading */}
      {state === 'loading' && (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Looking up album…</p>
        </div>
      )}

      {/* Success */}
      {state === 'success' && album && (
        <div className="glass-effect rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
            <p className="text-white font-semibold">Album found!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
              {album.coverUrl
                ? <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
                : <Folders className="w-7 h-7 text-white/20" />}
            </div>
            <div>
              <p className="text-white font-semibold">{album.title}</p>
              {album.description && <p className="text-white/40 text-xs mt-0.5">{album.description}</p>}
              <p className="text-white/30 text-xs mt-1">{album.photoCount} photo{album.photoCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/scan/${album.qrCode?.token}`)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
            >
              View Album
            </button>
            <button
              onClick={reset}
              className="px-4 py-2.5 rounded-xl text-sm text-white/60 border border-white/10 hover:border-white/20 transition-colors"
            >
              Scan Again
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {state === 'error' && (
        <div className="glass-effect rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <X className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-white font-semibold">Scan failed</p>
          </div>
          <p className="text-white/50 text-sm">{errorMsg}</p>
          <button
            onClick={reset}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white/70 border border-white/10 hover:border-white/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
