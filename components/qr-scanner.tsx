'use client';

import { useEffect, useRef, useState } from 'react';

interface QRScannerProps {
  onResult: (text: string) => void;
  onError?: (err: string) => void;
}

export default function QRScanner({ onResult, onError }: QRScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<import('html5-qrcode').Html5Qrcode | null>(null);
  const [started, setStarted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const resultReported = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      // Dynamically import to avoid SSR issues
      const { Html5Qrcode } = await import('html5-qrcode');

      if (!containerRef.current || cancelled) return;

      const id = 'qr-scanner-container';
      containerRef.current.id = id;

      const scanner = new Html5Qrcode(id);
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            if (resultReported.current) return;
            resultReported.current = true;
            void Promise.resolve(scanner.stop()).catch(() => {});
            onResult(decodedText);
          },
          () => {} // per-frame error — ignore
        );
        if (!cancelled) setStarted(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('denied')) {
          setPermissionDenied(true);
        }
        onError?.(msg);
      }
    }

    start();

    return () => {
      cancelled = true;
      void Promise.resolve(scannerRef.current?.stop()).catch(() => {});
      void Promise.resolve(scannerRef.current?.clear()).catch(() => {});
    };
  }, [onResult, onError]);

  if (permissionDenied) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-white/60 font-semibold">Camera access denied</p>
        <p className="text-white/30 text-sm mt-2">
          Please allow camera access in your browser settings and reload the page.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col items-center gap-4">
      {/* Scanner viewport */}
      <div
        ref={containerRef}
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ minHeight: 300 }}
      />

      {/* Crosshair overlay — visible before camera initialises */}
      {!started && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      <p className="text-white/30 text-xs">Align the QR code inside the frame</p>
    </div>
  );
}
