import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AR Memories — AR Viewer',
};

export default function ARViewerPage() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <title>AR Memories — AR Viewer</title>
        {/* AR.js + A-Frame loaded at runtime via script tags in the body */}
      </head>
      <body style={{ margin: 0, overflow: 'hidden', background: '#000' }}>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://cdn.jsdelivr.net/npm/aframe@1.5.0/dist/aframe.min.js" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://cdn.jsdelivr.net/npm/@ar-js-org/ar.js@3.4.5/aframe/build/aframe-ar.js" />
        <noscript>JavaScript is required for AR.</noscript>
        <div id="ar-root" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/ar-viewer-init.js" />
      </body>
    </html>
  );
}
