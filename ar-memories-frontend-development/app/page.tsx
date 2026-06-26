'use client';

import { Button } from '@/components/ui/button-glass';
import { useAuth } from '@/lib/auth-context';
import { ArrowRight, Award, Camera, CheckCircle2, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('/api/backend/health', { cache: 'no-store' });
        setBackendStatus(res.ok ? 'online' : 'offline');
      } catch {
        setBackendStatus('offline');
      }
    };

    checkBackend();
  }, []);

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="VR Album"
              className="h-14 w-auto object-contain drop-shadow-sm"
            />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              Backend: {backendStatus}
            </div>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="default">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gradient mb-6 leading-tight">
              Preserve Your Moments in AR
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Capture, preserve, and relive your precious memories in stunning augmented reality. Connect with professional photographers and create timeless experiences.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isAuthenticated && (
                <>
                  <Link href="/signup">
                    <Button className="px-8 py-6 text-lg gap-2 group">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="px-8 py-6 text-lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <Link href="/dashboard">
                  <Button className="px-8 py-6 text-lg gap-2">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Powerful Features</h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
              Everything you need to capture, preserve, and share your memories
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Camera className="w-8 h-8" />,
                  title: 'AR Camera',
                  description: 'Capture photos with advanced AR overlays and real-time effects'
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: 'Instant Sharing',
                  description: 'Share memories instantly via QR codes and direct links'
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: 'Professional Network',
                  description: 'Connect with photographers and studios worldwide'
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: 'Premium Quality',
                  description: 'High-resolution photos with professional editing tools'
                },
                {
                  icon: <CheckCircle2 className="w-8 h-8" />,
                  title: 'Secure Storage',
                  description: 'Your memories are securely stored and backed up'
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: 'Real-time Sync',
                  description: 'Access your albums from any device, anywhere'
                },
              ].map((feature, idx) => (
                <div key={idx} className="card-glass group hover:shadow-2xl transition-all">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card-glass mb-8">
              <h2 className="text-4xl font-bold mb-4">Ready to Preserve Your Memories?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of users capturing moments in stunning AR
              </p>
              {!isAuthenticated && (
                <Link href="/signup">
                  <Button className="px-8 py-6 text-lg gap-2 group">
                    Start for Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
            <p>&copy; 2024 AR Memories. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
