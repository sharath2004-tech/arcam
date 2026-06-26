'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button-glass';
import { Plus, Edit, Trash2, Upload, Star, Eye } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  views: number;
  rating: number;
  featured: boolean;
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    {
      id: '1',
      title: 'Summer Sunset Session',
      category: 'Portrait',
      views: 1243,
      rating: 4.8,
      featured: true,
    },
    {
      id: '2',
      title: 'Wedding Day Memories',
      category: 'Wedding',
      views: 856,
      rating: 4.9,
      featured: true,
    },
    {
      id: '3',
      title: 'Family Reunion',
      category: 'Family',
      views: 542,
      rating: 4.7,
      featured: false,
    },
    {
      id: '4',
      title: 'Corporate Event',
      category: 'Event',
      views: 324,
      rating: 4.5,
      featured: false,
    },
  ]);

  const handleDelete = (id: string) => {
    setPortfolio(portfolio.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Showcase your best work to clients</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-5 h-5" />
          Add Work
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-glass">
          <p className="text-muted-foreground text-sm mb-1">Total Views</p>
          <h3 className="text-3xl font-bold">{portfolio.reduce((acc, item) => acc + item.views, 0)}</h3>
        </div>
        <div className="card-glass">
          <p className="text-muted-foreground text-sm mb-1">Featured Items</p>
          <h3 className="text-3xl font-bold">{portfolio.filter(item => item.featured).length}</h3>
        </div>
        <div className="card-glass">
          <p className="text-muted-foreground text-sm mb-1">Average Rating</p>
          <h3 className="text-3xl font-bold">
            {(portfolio.reduce((acc, item) => acc + item.rating, 0) / portfolio.length).toFixed(1)}
            <span className="text-lg">⭐</span>
          </h3>
        </div>
      </div>

      {/* Portfolio Items */}
      <div className="space-y-3">
        {portfolio.map((item) => (
          <div key={item.id} className="card-glass flex items-center justify-between group hover:shadow-lg transition-all">
            {/* Thumbnail */}
            <div className="flex-1 flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <div className="text-3xl">📷</div>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">{item.category}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {item.views} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    {item.rating}
                  </div>
                </div>
              </div>

              {item.featured && (
                <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold flex-shrink-0">
                  Featured
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 ml-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      <div className="card-glass border-2 border-dashed border-border p-12 text-center">
        <div className="text-5xl mb-4">📸</div>
        <h3 className="text-2xl font-bold mb-2">Add New Work</h3>
        <p className="text-muted-foreground mb-6">Drag and drop your photos or click to browse</p>
        <Button className="gap-2">
          <Upload className="w-5 h-5" />
          Upload Photos
        </Button>
      </div>
    </div>
  );
}
