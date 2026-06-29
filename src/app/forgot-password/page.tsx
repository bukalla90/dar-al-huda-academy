// src/app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, ArrowLeft, User, Phone, MessageCircle, CheckCircle, Globe } from 'lucide-react';

export default function ForgotPasswordPage(): React.ReactNode {
  const [step, setStep] = useState<number>(1);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  async function handleRequestReset(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username || username.length < 3) {
      setError('Please enter a valid username');
      setLoading(false);
      return;
    }

    try {
      // Call API that checks user exists, gets full name, and creates notification
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (data.success) {
        setStep(2);
      } else {
        setError(data.error || 'Username not found');
      }
    } catch (err) {
      setError('Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-text dark:text-white">Dar Al Huda</h1>
        </div>

        {step === 1 ? (
          <Card className="border-0 shadow-2xl dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="space-y-1 text-center pb-2">
              <CardTitle className="text-2xl font-bold dark:text-white">Forgot Password?</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Enter your username and the admin will be notified to reset it
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleRequestReset} className="space-y-5">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium dark:text-gray-300">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-base font-semibold shadow-lg">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : 'Request Password Reset'}
                </Button>

                <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                  <ArrowLeft className="h-4 w-4" />Back to Login
                </Link>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-2xl dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-text dark:text-white mb-2">Request Submitted!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                The admin has been notified. They will reset your password and contact you.
              </p>

              <div className="space-y-3 mb-6">
                <a href="tel:+251914600349" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Phone className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium dark:text-white">Call Us</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">+251 91 460 0349</p>
                  </div>
                </a>
                <a href="https://t.me/jemil1456" target="_blank" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium dark:text-white">Telegram</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@jemil1456</p>
                  </div>
                </a>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl mb-6">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  After receiving your new password, please change it from your dashboard settings.
                </p>
              </div>

              <Link href="/login">
                <Button className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-xl">
                  <ArrowLeft className="h-4 w-4 mr-2" />Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 inline-flex items-center gap-1">
            <Globe className="h-4 w-4" />Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}