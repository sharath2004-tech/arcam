'use client';

import { Folders, Plus } from 'lucide-react';

export default function StudioAlbums() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Albums</h1>
          <p className="text-white/50 text-sm mt-1">All albums created by your studio.</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}>
          <Plus className="w-4 h-4" />New Album
        </button>
      </div>
      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <Folders className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">No albums yet</p>
        <p className="text-white/30 text-sm mt-2">Albums created by your studio will appear here.</p>
      </div>
    </div>
  );
}
