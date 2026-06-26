'use client';

import { Button } from '@/components/ui/button-glass';
import { useAuth } from '@/lib/auth-context';
import { ArrowRight, Award, Camera, CheckCircle2, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${backendBaseUrl}/health`, { cache: 'no-store' });
        setBackendStatus(res.ok ? 'online' : 'offline');
      } catch {
        setBackendStatus('offline');
      }
    };
    checkBackend();
  }, []);

  return (
    <>
      {/* Navigation — always dark glass, respects status bar safe area */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/75 border-b border-white/10"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="w-full px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="VR Album"
              className="h-10 w-auto object-contain drop-shadow-lg"
            />
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <button
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.65 0.22 20))' }}
                >
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 border border-white/20 hover:border-white/40 hover:text-white hover:bg-white/8 transition-all">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                    style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.65 0.22 20))' }}
                  >
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section
          className="relative pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 6rem)' }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.55 0.24 15 / 0.18) 0%, transparent 70%)',
            }}
          />
          <div className="max-w-5xl mx-auto text-center relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/70 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Augmented Reality · Photography · Memories
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight text-gradient">
              Preserve Your<br />Moments in AR
            </h1>
            <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Capture, preserve, and relive your precious memories in stunning augmented reality.
              Connect with professional photographers and create timeless experiences.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isAuthenticated && (
                <>
                  <Link href="/signup">
                    <button
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 active:scale-95"
                      style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
                    >
                      Get Started Free
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white/80 border border-white/20 bg-white/5 backdrop-blur transition-all hover:bg-white/10 hover:text-white hover:border-white/30 active:scale-95">
                      Sign In
                    </button>
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <Link href="/dashboard">
                  <button
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
                    style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-white">Powerful Features</h2>
            <p className="text-center text-white/50 mb-14 max-w-xl mx-auto">
              Everything you need to capture, preserve, and share your memories
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: <Camera className="w-6 h-6" />, title: 'AR Camera', description: 'Capture photos with advanced AR overlays and real-time effects' },
                { icon: <Zap className="w-6 h-6" />, title: 'Instant Sharing', description: 'Share memories instantly via QR codes and direct links' },
                { icon: <Users className="w-6 h-6" />, title: 'Professional Network', description: 'Connect with photographers and studios worldwide' },
                { icon: <Award className="w-6 h-6" />, title: 'Premium Quality', description: 'High-resolution photos with professional editing tools' },
                { icon: <CheckCircle2 className="w-6 h-6" />, title: 'Secure Storage', description: 'Your memories are securely stored and backed up' },
                { icon: <Zap className="w-6 h-6" />, title: 'Real-time Sync', description: 'Access your albums from any device, anywhere' },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group rounded-xl p-6 border border-white/8 bg-white/4 backdrop-blur hover:border-white/20 hover:bg-white/8 transition-all"
                >
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform"
                    style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur p-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Ready to Preserve Your Memories?</h2>
              <p className="text-white/50 mb-8 text-lg">
                Join thousands of users capturing moments in stunning AR
              </p>
              {!isAuthenticated && (
                <Link href="/signup">
                  <button
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
                  >
                    Start for Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/8 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center text-white/30 text-sm">
            <p>&copy; 2025 VR Album. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
