'use client';

import { Button } from '@/components/ui/button-glass';
import { FormField } from '@/components/ui/form-field';
import { useAuth, type UserRole } from '@/lib/auth-context';
import { Camera, Loader2, User, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');

  const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    { value: 'customer', label: 'Customer', icon: <User className="w-4 h-4" /> },
    { value: 'photographer', label: 'Photographer', icon: <Camera className="w-4 h-4" /> },
    { value: 'studio_manager', label: 'Studio Manager', icon: <Users className="w-4 h-4" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await signup(email, password, name, role);
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">AR Memories</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        {/* Glass Card */}
        <div className="card-glass mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <FormField
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />

            <FormField
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <FormField
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              hint="At least 8 characters"
            />

            {/* Role Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      role === r.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                    disabled={isLoading}
                  >
                    {r.icon}
                    <span className="text-xs font-medium">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
