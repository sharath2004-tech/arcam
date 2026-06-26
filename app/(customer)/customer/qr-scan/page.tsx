'use client';

import { QrCode } from 'lucide-react';

export default function CustomerQRScan() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Scan QR</h1>
        <p className="text-white/50 text-sm mt-1">Scan a QR code to access a shared album.</p>
      </div>
      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <QrCode className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">QR Scanner</p>
        <p className="text-white/30 text-sm mt-2">QR code scanning is available in the mobile app.</p>
      </div>
    </div>
  );
}
