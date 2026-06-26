'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button-glass';
import { FormField } from '@/components/ui/form-field';
import { Plus, Download, Trash2, Copy, Share2 } from 'lucide-react';

interface QRCode {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  scans: number;
}

export default function QRCodesPage() {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([
    {
      id: '1',
      name: 'Summer Album 2024',
      url: 'ar-memories.com/album/summer2024',
      createdAt: '2024-06-10',
      scans: 245,
    },
    {
      id: '2',
      name: 'Wedding Photos',
      url: 'ar-memories.com/album/wedding2024',
      createdAt: '2024-05-20',
      scans: 1203,
    },
    {
      id: '3',
      name: 'Family Reunion',
      url: 'ar-memories.com/album/family2024',
      createdAt: '2024-04-15',
      scans: 567,
    },
  ]);

  const [newQRName, setNewQRName] = useState('');

  const handleCreateQR = () => {
    if (newQRName.trim()) {
      const newQR: QRCode = {
        id: (qrCodes.length + 1).toString(),
        name: newQRName,
        url: `ar-memories.com/album/${newQRName.toLowerCase().replace(/\s+/g, '')}`,
        createdAt: new Date().toISOString().split('T')[0],
        scans: 0,
      };
      setQRCodes([...qrCodes, newQR]);
      setNewQRName('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">QR Codes</h1>
          <p className="text-muted-foreground">Generate and manage shareable QR codes for your albums</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-5 h-5" />
          Generate QR
        </Button>
      </div>

      {/* Create New QR */}
      <div className="card-glass">
        <h3 className="font-bold mb-4">Generate New QR Code</h3>
        <div className="flex gap-2">
          <FormField
            placeholder="Album name"
            value={newQRName}
            onChange={(e) => setNewQRName(e.target.value)}
          />
          <Button onClick={handleCreateQR} disabled={!newQRName.trim()}>
            Generate
          </Button>
        </div>
      </div>

      {/* QR Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCodes.map((qr) => (
          <div key={qr.id} className="card-glass">
            {/* QR Code Preview */}
            <div className="w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center mb-4 border-4 border-white dark:border-slate-700">
              <div className="text-4xl">📱</div>
            </div>

            {/* QR Info */}
            <h3 className="font-bold mb-1 truncate">{qr.name}</h3>
            <p className="text-xs text-muted-foreground mb-4 truncate">{qr.url}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Scans</p>
                <p className="font-bold text-lg">{qr.scans}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-bold text-sm">{qr.createdAt}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
              <Button variant="outline" size="sm" className="gap-1 col-span-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            {/* Delete */}
            <button className="mt-2 w-full p-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4 inline mr-1" />
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* QR Codes Activity */}
      <div className="card-glass">
        <h2 className="text-xl font-bold mb-4">Top Performing QR Codes</h2>
        <div className="space-y-3">
          {qrCodes.sort((a, b) => b.scans - a.scans).map((qr) => (
            <div key={qr.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{qr.name}</p>
                <p className="text-xs text-muted-foreground">{qr.url}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{qr.scans}</p>
                <p className="text-xs text-muted-foreground">scans</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
