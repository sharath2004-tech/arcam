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
