'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button-glass';
import { Camera, Maximize2, Grid3x3, Settings, Share2, Download, RotateCcw } from 'lucide-react';

export default function ARCameraPage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [grid, setGrid] = useState(false);
  const [photos, setPhotos] = useState<string[]>([
    '📸', '📸', '📸', '📸'
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">AR Camera</h1>
        <p className="text-muted-foreground">Capture stunning moments with AR effects and overlays</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Preview */}
        <div className="lg:col-span-2">
          <div className="card-glass overflow-hidden">
            {cameraActive ? (
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative">
                  {/* Mock camera feed */}
                  <div className="text-6xl opacity-50">📷</div>
                  {grid && (
                    <div className="absolute inset-0 opacity-20">
                      <div className="grid grid-cols-3 grid-rows-3 h-full">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="border border-white"></div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* AR Overlay Demo */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500 text-white text-sm font-semibold animate-pulse">
                    REC
                  </div>
                </div>

                {/* Controls */}
                <div className="p-6 space-y-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setGrid(!grid)}>
                      <Grid3x3 className="w-5 h-5" />
                      Grid
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-5 h-5" />
                      Effects
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Maximize2 className="w-5 h-5" />
                      Fullscreen
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2" onClick={() => setCameraActive(false)}>
                      <Camera className="w-5 h-5" />
                      Take Photo
                    </Button>
                    <Button variant="secondary" onClick={() => setCameraActive(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📷</div>
                <h3 className="text-2xl font-bold mb-2">Start AR Camera</h3>
                <p className="text-muted-foreground mb-6">
                  Enable your camera to capture photos with AR effects
                </p>
                <Button className="gap-2" onClick={() => setCameraActive(true)}>
                  <Camera className="w-5 h-5" />
                  Open Camera
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Photos */}
          <div className="card-glass">
            <h3 className="font-bold mb-4">Recent Photos</h3>
            <div className="grid grid-cols-2 gap-2">
              {photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl hover:shadow-lg transition-all cursor-pointer"
                >
                  {photo}
                </div>
              ))}
            </div>
          </div>

          {/* Effects */}
          <div className="card-glass">
            <h3 className="font-bold mb-4">AR Effects</h3>
            <div className="space-y-2">
              {['Glow', 'Blur', 'Sparkle', 'Rainbow', 'Mirror', 'Kaleidoscope'].map((effect) => (
                <button
                  key={effect}
                  className="w-full p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left text-sm"
                >
                  {effect}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="ghost" className="w-full gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
