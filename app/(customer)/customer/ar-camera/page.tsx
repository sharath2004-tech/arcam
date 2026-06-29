'use client';

import { Camera, Info, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CustomerARCamera() {
  // Must be detected client-side — navigator is undefined during static export build
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(/android|iphone|ipad|mobile/i.test(navigator.userAgent));
  }, []);

  function launchAR() {
    // Navigate to standalone AR viewer HTML (bypasses Next.js layout)
    window.location.href = '/ar-viewer.html';
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AR Camera</h1>
        <p className="text-white/50 text-sm mt-1">Scan a printed photo to play its AR experience.</p>
      </div>

      <div className="glass-effect rounded-2xl p-6 flex items-start gap-4">
        <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <p className="text-white/60 text-sm">
          Point your camera at a printed photo from an AR Memories album to watch the video memory come to life.
          Make sure you&apos;re in a well-lit area for best results.
        </p>
      </div>

      {isMobile ? (
        <button
          onClick={launchAR}
          className="w-full glass-effect rounded-2xl p-10 flex flex-col items-center text-center gap-5 hover:bg-white/5 transition-colors"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">Launch AR Camera</p>
            <p className="text-white/40 text-sm mt-1">
              Tap to open the camera and scan a printed photo.
            </p>
          </div>
          <span
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
          >
            Open Camera
          </span>
        </button>
      ) : (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center gap-4">
          <Smartphone className="w-14 h-14 text-white/20" />
          <p className="text-white/50 font-semibold text-lg">Open on your phone</p>
          <p className="text-white/30 text-sm max-w-sm">
            The AR camera requires a mobile device with a rear camera. Visit this page on your phone or use the AR Memories app.
          </p>
        </div>
      )}

      {/* How it works */}
      <div className="glass-effect rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm">How it works</h2>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Print a photo from any AR Memories album.' },
            { step: '2', text: 'Open the AR Camera and point at the printed photo.' },
            { step: '3', text: 'Watch the video memory play right on top of the photo.' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <span
                className="w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
              >
                {step}
              </span>
              <p className="text-white/60 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

