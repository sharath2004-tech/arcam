import { Metadata } from 'next';
import ScanClient from './scan-client';

export const metadata: Metadata = {
  title: 'AR Memories — View Album',
};

// Required for Next.js static export (output: 'export').
// A placeholder is needed; the actual token is read client-side via useParams.
export async function generateStaticParams() {
  return [{ token: '_' }];
}

export default function ScanPage() {
  return <ScanClient />;
}
