export interface Photo {
  url: string;
  caption: string;
  uploadedAt: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  ownerRole: string;
  coverUrl: string | null;
  photos: Photo[];
  customerIds: string[];
  isPublic: boolean;
  qrCode: { token: string; qrUrl: string; scans: number; createdAt: string } | null;
  totalViews: number;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  clientName: string;
  clientEmail: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  ownerId: string;
  ownerRole: string;
  albumId: string | null;
  createdAt: string;
  updatedAt: string;
}
