'use client';

import { api } from '@/lib/api';
import type { Album, Photo } from '@/lib/types';
import { ArrowLeft, Film, ImageIcon, Play, Plus, Star, Trash2, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';
const TOKEN_KEY = 'ar_token';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

async function uploadFile(file: File, type: 'image' | 'video'): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE_URL}/api/upload/${type}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.message || 'Upload failed');
  return data.url as string;
}

type Stage = 'idle' | 'uploading-video' | 'uploading-photos' | 'saving' | 'done';

interface PhotoDraft {
  file: File;
  preview: string;
  caption: string;
}

export default function AlbumClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  // Multi-photo drafts + shared video
  const [drafts, setDrafts] = useState<PhotoDraft[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get<{ album: Album }>(`/api/albums/${id}`)
      .then(({ album }) => setAlbum(album))
      .catch(() => router.push('/photographer/albums'))
      .finally(() => setLoading(false));
  }, [id, router]);

  function onPhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newDrafts: PhotoDraft[] = files.map(f => ({ file: f, preview: URL.createObjectURL(f), caption: '' }));
    setDrafts(prev => [...prev, ...newDrafts]);
  }

  function onVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  }

  function removeDraft(index: number) {
    setDrafts(prev => prev.filter((_, i) => i !== index));
  }

  function updateCaption(index: number, caption: string) {
    setDrafts(prev => prev.map((d, i) => i === index ? { ...d, caption } : d));
  }

  function resetUpload() {
    setDrafts([]); setVideoFile(null); setVideoPreview(null);
    setStage('idle'); setProgress(''); setUploadError('');
    if (photoInputRef.current) photoInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (drafts.length === 0) { setUploadError('Select at least one photo'); return; }
    setUploadError('');
    try {
      // 1. Upload the shared video once (if any)
      let videoUrl: string | null = null;
      if (videoFile) {
        setStage('uploading-video');
        setProgress('Uploading video…');
        videoUrl = await uploadFile(videoFile, 'video');
      }

      // 2. Upload all photos in parallel
      setStage('uploading-photos');
      setProgress(`Uploading ${drafts.length} photo${drafts.length > 1 ? 's' : ''}…`);
      const photoUrls = await Promise.all(drafts.map(d => uploadFile(d.file, 'image')));

      // 3. Batch-save — all photos share the same videoUrl
      setStage('saving');
      setProgress('Saving to album…');
      const payload = photoUrls.map((url, i) => ({ url, videoUrl, caption: drafts[i].caption }));
      const { photos: saved } = await api.post<{ photos: Photo[] }>(`/api/albums/${id}/photos/batch`, { photos: payload });

      setAlbum(prev => prev ? { ...prev, photos: [...prev.photos, ...saved], photoCount: prev.photoCount + saved.length } : prev);
      resetUpload();
      setShowUpload(false);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
      setStage('idle');
    }
  }

  async function handleSetCover(photoUrl: string) {
    try {
      await api.put(`/api/albums/${id}`, { coverUrl: photoUrl });
      setAlbum(prev => prev ? { ...prev, coverUrl: photoUrl } : prev);
    } catch {}
  }

  async function handleDeletePhoto(photoUrl: string) {
    if (!confirm('Remove this photo?')) return;
    setDeleting(photoUrl);
    try {
      await fetch(`${BASE_URL}/api/albums/${id}/photos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ url: photoUrl }),
      });
      setAlbum(prev => prev ? { ...prev, photos: prev.photos.filter(p => p.url !== photoUrl), photoCount: prev.photoCount - 1 } : prev);
    } catch {}
    setDeleting(null);
  }

  const busy = stage !== 'idle' && stage !== 'done';

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }
  if (!album) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/photographer/albums" className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white truncate">{album.title}</h1>
          {album.description && <p className="text-white/50 text-sm mt-0.5">{album.description}</p>}
        </div>
        <span className="text-white/30 text-sm">{album.photoCount} photo{album.photoCount !== 1 ? 's' : ''}</span>
        <button
          onClick={() => { resetUpload(); setShowUpload(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
        >
          <Plus className="w-4 h-4" />Add Photos
        </button>
      </div>

      {/* Photo Grid */}
      {album.photos.length === 0 ? (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
          <ImageIcon className="w-14 h-14 text-white/20 mb-4" />
          <p className="text-white/50 font-semibold text-lg">No photos yet</p>
          <p className="text-white/30 text-sm mt-2">Upload photos and link a video — all photos share the same AR video.</p>
          <button
            onClick={() => { resetUpload(); setShowUpload(true); }}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
          >
            <Upload className="w-4 h-4" />Upload Photos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {album.photos.map((photo) => (
            <div key={photo.url} className="group relative rounded-2xl overflow-hidden aspect-square bg-white/5">
              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
              {photo.videoUrl && (
                <button
                  onClick={() => setPlayingUrl(photo.videoUrl!)}
                  className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 text-white text-xs backdrop-blur-sm hover:bg-primary/80 transition-colors"
                >
                  <Play className="w-3 h-3 fill-white" />AR
                </button>
              )}
              {album.coverUrl === photo.url && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-yellow-500/80 text-black text-xs font-semibold">Cover</div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 gap-1">
                {photo.caption && <p className="flex-1 text-white/80 text-xs truncate mr-1">{photo.caption}</p>}
                <button onClick={() => handleSetCover(photo.url)} title="Set as cover"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-yellow-500/30 text-white/70 hover:text-yellow-400 transition-colors">
                  <Star className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDeletePhoto(photo.url)} disabled={deleting === photo.url}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/70 hover:text-red-400 transition-colors disabled:opacity-40">
                  {deleting === photo.url
                    ? <div className="w-3.5 h-3.5 border border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                    : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video player */}
      {playingUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl">
            <button onClick={() => setPlayingUrl(null)} className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <video src={playingUrl} controls autoPlay className="w-full rounded-2xl" />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-effect rounded-2xl p-6 w-full max-w-lg space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Add Photos</h2>
              <button onClick={() => { setShowUpload(false); resetUpload(); }} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              {/* Photo picker — multiple */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/70 text-sm font-medium">
                    Photos <span className="text-red-400">*</span>
                  </label>
                  {drafts.length > 0 && (
                    <button type="button" onClick={() => photoInputRef.current?.click()}
                      className="text-primary text-xs hover:underline">+ Add more</button>
                  )}
                </div>
                <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={onPhotosChange} className="hidden" />
                {drafts.length === 0 ? (
                  <button type="button" onClick={() => photoInputRef.current?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-white/10 hover:border-primary/40 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white/70 transition-colors">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm">Click to select photos (multiple allowed)</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {drafts.map((d, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden aspect-square bg-white/5 group">
                        <img src={d.preview} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeDraft(i)}
                          className="absolute top-1 right-1 p-1 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                        <input
                          type="text"
                          value={d.caption}
                          onChange={e => updateCaption(i, e.target.value)}
                          placeholder="Caption…"
                          className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-xs px-2 py-1 focus:outline-none placeholder:text-white/40"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {drafts.length > 0 && (
                  <p className="text-white/30 text-xs mt-1.5">{drafts.length} photo{drafts.length > 1 ? 's' : ''} selected</p>
                )}
              </div>

              {/* Single video — linked to ALL photos */}
              <div>
                <label className="text-white/70 text-sm font-medium block mb-1">
                  AR Video <span className="text-white/30 font-normal">(one video, plays for all photos when scanned)</span>
                </label>
                <input ref={videoInputRef} type="file" accept="video/*" onChange={onVideoChange} className="hidden" />
                {videoPreview ? (
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black/20">
                    <video src={videoPreview} className="w-full h-full object-contain" muted />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
                        <Film className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <button type="button" onClick={() => { setVideoFile(null); setVideoPreview(null); if (videoInputRef.current) videoInputRef.current.value = ''; }}
                      className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <p className="absolute bottom-2 left-2 text-xs text-white/60 bg-black/50 px-2 py-0.5 rounded-lg">{videoFile?.name}</p>
                  </div>
                ) : (
                  <button type="button" onClick={() => videoInputRef.current?.click()}
                    className="w-full h-24 rounded-xl border-2 border-dashed border-white/10 hover:border-primary/40 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white/70 transition-colors">
                    <Film className="w-6 h-6" />
                    <span className="text-sm">Click to select AR video (optional)</span>
                  </button>
                )}
              </div>

              {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}

              {/* Progress */}
              {busy && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin shrink-0" />
                  <span className="text-white/70 text-sm">{progress}</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowUpload(false); resetUpload(); }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 border border-white/10 hover:border-white/20 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={drafts.length === 0 || busy}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-40 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}>
                  <Upload className="w-4 h-4" />
                  {busy ? progress : `Upload ${drafts.length || ''} Photo${drafts.length !== 1 ? 's' : ''}${videoFile ? ' + Video' : ''}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
