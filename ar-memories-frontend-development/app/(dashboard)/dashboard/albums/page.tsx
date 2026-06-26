'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button-glass';
import { Plus, Search, Trash2, Share2, Download } from 'lucide-react';
import { FormField } from '@/components/ui/form-field';

interface Album {
  id: string;
  name: string;
  description: string;
  photoCount: number;
  createdAt: string;
  thumbnail?: string;
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([
    {
      id: '1',
      name: 'Summer 2024',
      description: 'Beach vacation memories',
      photoCount: 24,
      createdAt: '2024-06-15',
    },
    {
      id: '2',
      name: 'Wedding Day',
      description: 'Our special day',
      photoCount: 156,
      createdAt: '2024-05-20',
    },
    {
      id: '3',
      name: 'Family Gathering',
      description: 'Reunions and celebrations',
      photoCount: 48,
      createdAt: '2024-04-10',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlbums = albums.filter(album =>
    album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">My Albums</h1>
          <p className="text-muted-foreground">Organize and manage your photo collections</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-5 h-5" />
          Create Album
        </Button>
      </div>

      {/* Search */}
      <div className="card-glass">
        <FormField
          placeholder="Search albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Albums Grid */}
      {filteredAlbums.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <div key={album.id} className="card-glass group overflow-hidden hover:shadow-2xl transition-all">
              {/* Placeholder thumbnail */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 rounded-lg">
                <div className="text-4xl opacity-50">📷</div>
              </div>

              <h3 className="text-xl font-bold mb-1">{album.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{album.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {album.photoCount} photos
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(album.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="flex-1 gap-1">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-1">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-glass text-center py-12">
          <p className="text-muted-foreground mb-4">No albums found</p>
          <Button>Create your first album</Button>
        </div>
      )}
    </div>
  );
}
