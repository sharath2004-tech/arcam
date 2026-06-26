'use client';

import { Camera, Info } from 'lucide-react';

export default function CustomerARCamera() {
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

      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <Camera className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">AR Camera</p>
        <p className="text-white/30 text-sm mt-2 max-w-sm">
          Available in the mobile app. Open this page on your phone to launch the AR camera.
        </p>
      </div>
    </div>
  );
}
