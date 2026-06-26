'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button-glass';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { verifyOTP, isLoading } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    try {
      if (!email) {
        setError('Email not found. Please try again.');
        return;
      }
      await verifyOTP(email, otpCode);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
    }
  };

  const handleResend = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <p className="text-muted-foreground mb-4">Email not found</p>
          <Link href="/login">
            <Button>Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Verify OTP</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to<br />
            <span className="font-semibold text-foreground">{email}</span>
          </p>
        </div>

        {/* Glass Card */}
        <div className="card-glass mb-6">
          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* OTP Input */}
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  data-index={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && index > 0) {
                      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
                      prevInput?.focus();
                    }
                  }}
                  className="w-12 h-12 text-center text-2xl font-bold rounded-lg border-2 border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || otp.some(d => !d)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
              <Button
                type="button"
                variant="ghost"
                disabled={resendCooldown > 0}
                onClick={handleResend}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </Button>
            </div>

            <Link href="/login" className="block">
              <Button variant="ghost" className="w-full justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
