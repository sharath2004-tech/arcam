import { useState } from 'react';
import AlbumClient from './album-client';

// Required for Next.js static export — actual id read client-side via useParams.
export async function generateStaticParams() {
  return [{ id: '_' }];
}

export default function AlbumDetailPage() {
  return <AlbumClient />;
}

interface Photo {
  url: string;
  caption: string;
  videoUrl: string | null;
}

interface MockAlbum {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  photos: Photo[];
}

const MOCK_ALBUMS: Record<string, MockAlbum> = {
  '1': { id: '1', title: 'Summer 2024', description: 'Beach vacation memories', coverUrl: null, photos: [] },
  '2': { id: '2', title: 'Wedding Day', description: 'Our special day', coverUrl: null, photos: [] },
  '3': { id: '3', title: 'Family Gathering', description: 'Reunions and celebrations', coverUrl: null, photos: [] },
};

type Stage = 'idle' | 'uploading' | 'done';

export default function AlbumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const album = MOCK_ALBUMS[id as string] || { id, title: 'Album', description: '', coverUrl: null, photos: [] };

  const [photos, setPhotos] = useState<Photo[]>(album.photos);
  const [coverUrl, setCoverUrl] = useState<string | null>(album.coverUrl);
  const [showUpload, setShowUpload] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  }

  function onVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setVideoPreview(URL.createObjectURL(file));
  }

  function resetForm() {
    setPhotoPreview(null); setVideoPreview(null); setCaption(''); setStage('idle');
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!photoPreview) return;
    setStage('uploading');
    await new Promise(r => setTimeout(r, 1200));
    const newPhoto: Photo = { url: photoPreview, caption, videoUrl: videoPreview };
    setPhotos(prev => [...prev, newPhoto]);
    if (!coverUrl) setCoverUrl(photoPreview);
    setStage('done');
    resetForm();
    setShowUpload(false);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/albums">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gradient truncate">{album.title}</h1>
          {album.description && <p className="text-muted-foreground mt-0.5">{album.description}</p>}
        </div>
        <Button onClick={() => { resetForm(); setShowUpload(true); }} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />Add Photo
        </Button>
      </div>

      {/* Grid */}
      {photos.length === 0 ? (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
          <ImageIcon className="w-14 h-14 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-semibold text-lg">No photos yet</p>
          <p className="text-muted-foreground/60 text-sm mt-2">Upload photos and link a video for the AR experience.</p>
          <Button className="mt-6 gap-2" onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4" />Upload First Photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden aspect-square bg-muted cursor-pointer" onClick={() => setSelected(photo.url)}>
              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
              {photo.videoUrl && (
                <button
                  onClick={e => { e.stopPropagation(); setPlayingUrl(photo.videoUrl!); }}
                  className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 text-white text-xs backdrop-blur-sm hover:bg-primary/80 transition-colors"
                >
                  <Play className="w-3 h-3 fill-white" />AR
                </button>
              )}
              {coverUrl === photo.url && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-yellow-500/80 text-black text-xs font-semibold">Cover</div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 gap-1">
                <button onClick={e => { e.stopPropagation(); setCoverUrl(photo.url); }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-yellow-400/30 text-white/70 hover:text-yellow-400 transition-colors">
                  <Star className="w-3.5 h-3.5" />
                </button>
                <button onClick={e => { e.stopPropagation(); setPhotos(p => p.filter((_, j) => j !== i)); }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/70 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setSelected(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white"><X className="w-7 h-7" /></button>
          <img src={selected} alt="" className="max-w-full max-h-full rounded-2xl object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Video player */}
      {playingUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl">
            <button onClick={() => setPlayingUrl(null)} className="absolute -top-10 right-0 text-white/60 hover:text-white"><X className="w-6 h-6" /></button>
            <video src={playingUrl} controls autoPlay className="w-full rounded-2xl" />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-effect rounded-2xl p-6 w-full max-w-lg space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Add Photo</h2>
              <button onClick={() => { setShowUpload(false); resetForm(); }} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              {/* Photo */}
              <div>
                <label className="text-foreground/70 text-sm font-medium block mb-2">Photo <span className="text-destructive">*</span></label>
                {photoPreview ? (
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black/20">
                    <img src={photoPreview} alt="preview" className="w-full h-full object-contain" />
                    <button type="button" onClick={() => setPhotoPreview(null)} className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <label className="w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm">Click to select a photo</span>
                    <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Video */}
              <div>
                <label className="text-foreground/70 text-sm font-medium block mb-1">AR Video <span className="text-muted-foreground font-normal">(optional)</span></label>
                {videoPreview ? (
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black/20">
                    <video src={videoPreview} className="w-full h-full object-contain" muted />
                    <div className="absolute inset-0 flex items-center justify-center"><div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center"><Film className="w-5 h-5 text-white" /></div></div>
                    <button type="button" onClick={() => setVideoPreview(null)} className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <label className="w-full h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <Film className="w-6 h-6" />
                    <span className="text-sm">Click to select a video</span>
                    <input type="file" accept="video/*" onChange={onVideoChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Caption */}
              <div>
                <label className="text-foreground/70 text-sm font-medium block mb-1.5">Caption <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Birthday celebration"
                  className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50" />
              </div>

              {stage === 'uploading' && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-primary rounded-full animate-spin shrink-0" />
                  <span className="text-muted-foreground text-sm">Uploading…</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => { setShowUpload(false); resetForm(); }} className="flex-1">Cancel</Button>
                <Button type="submit" disabled={!photoPreview || stage === 'uploading'} className="flex-1 gap-2">
                  <Upload className="w-4 h-4" />{stage === 'uploading' ? 'Uploading…' : 'Upload'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
