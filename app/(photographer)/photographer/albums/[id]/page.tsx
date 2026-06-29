import AlbumClient from './album-client';

// Required for Next.js static export - actual id read client-side via useParams.
export async function generateStaticParams() {
  return [{ id: '_' }];
}

export default function PhotographerAlbumPage() {
  return <AlbumClient />;
}
