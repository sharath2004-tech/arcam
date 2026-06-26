'use client';

import { Folders } from 'lucide-react';

export default function AdminAlbums() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Albums</h1>
        <p className="text-white/50 text-sm mt-1">All albums across the platform.</p>
      </div>
      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <Folders className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">No albums yet</p>
        <p className="text-white/30 text-sm mt-2">Albums created across the platform will appear here.</p>
      </div>
    </div>
  );
}
