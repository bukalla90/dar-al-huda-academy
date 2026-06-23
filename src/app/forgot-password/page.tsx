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

    try {
      // TODO: In real app, this would notify admin
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(2);
    } catch (err) {
      setError('Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-text">Dar Al Huda</h1>
        </div>

        {step === 1 ? (
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1 text-center pb-2">
              <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
              <CardDescription>
                Enter your username and we&apos;ll help you reset your password
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleRequestReset} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Request Password Reset'
                  )}
                </Button>

                <Link 
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-2xl">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-text mb-2">Request Submitted!</h2>
              <p className="text-gray-500 mb-6">
                Your password reset request has been sent to the admin. 
                Please contact the admin through one of the following ways to get your new password:
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Call Us</p>
                    <p className="text-sm text-gray-500">+123 456 7890</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium">WhatsApp</p>
                    <p className="text-sm text-gray-500">+123 456 7890</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                <p className="text-sm text-amber-800">
                  After receiving your new password, please change it from your dashboard settings.
                </p>
              </div>

              <Link href="/login">
                <Button className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-xl">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <Globe className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}