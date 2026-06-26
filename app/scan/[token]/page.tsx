import { Metadata } from 'next';
import ScanClient from './scan-client';

export const metadata: Metadata = {
  title: 'AR Memories — View Album',
};

export default function ScanPage({ params }: { params: { token: string } }) {
  return <ScanClient token={params.token} />;
}
