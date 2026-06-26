'use client';

import { QrCode, Download } from 'lucide-react';

export default function PhotographerQRCodes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">QR Codes</h1>
          <p className="text-white/50 text-sm mt-1">Generate QR codes for album access.</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
        >
          <QrCode className="w-4 h-4" />Generate QR
        </button>
      </div>
      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <QrCode className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">No QR codes yet</p>
        <p className="text-white/30 text-sm mt-2">Generate QR codes to give customers quick album access.</p>
      </div>
    </div>
  );
}
