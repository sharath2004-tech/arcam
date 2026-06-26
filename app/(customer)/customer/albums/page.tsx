'use client';

import { Album, Search } from 'lucide-react';

export default function CustomerAlbums() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Albums</h1>
          <p className="text-white/50 text-sm mt-1">All albums shared with you.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search albums..."
            className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 w-52"
          />
        </div>
      </div>

      {/* Empty state */}
      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <Album className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">No albums yet</p>
        <p className="text-white/30 text-sm mt-2 max-w-sm">
          When a photographer shares an album with you, it will appear here.
        </p>
      </div>
    </div>
  );
}
