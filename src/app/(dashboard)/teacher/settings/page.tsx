// src/app/(dashboard)/teacher/settings/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Eye, EyeOff, Loader2, Lock, User, Check, X } from 'lucide-react';
import Link from 'next/link';

const settingsSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  newUsername: z.string().optional(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function TeacherSettingsPage(): React.ReactNode {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  const newUsername = watch('newUsername');

  async function checkUsername(username: string): Promise<void> {
    if (!username || username.length < 4) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    try {
      const res = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      setUsernameAvailable(data.available);
    } catch {
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  }

  async function onSubmit(data: SettingsForm): Promise<void> {
    setLoading(true);
    setMessage(null);

    if (data.newUsername && data.newUsername.length >= 4 && usernameAvailable === false) {
      setMessage({ type: 'error', text: 'Username is already taken.' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/teacher/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0 max-w-lg mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/teacher">
          <Button variant="ghost" size="icon" className="dark:hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5 dark:text-gray-300" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Change password & Username</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {message && (
              <div className={`p-3 rounded-xl text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                  : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <div>
              <Label className="dark:text-gray-300">New Username (optional)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  {...register('newUsername')}
                  placeholder="Leave blank to keep current"
                  autoComplete="off"
                  onChange={(e) => {
                    register('newUsername').onChange(e);
                    checkUsername(e.target.value);
                  }}
                  className={`pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    usernameAvailable === true ? 'border-green-500' : 
                    usernameAvailable === false ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {checkingUsername && (
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Checking...
                </p>
              )}
              {usernameAvailable === true && newUsername && newUsername.length >= 4 && (
                <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Available
                </p>
              )}
              {usernameAvailable === false && newUsername && newUsername.length >= 4 && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <X className="h-3 w-3" /> Taken
                </p>
              )}
            </div>

            <div>
              <Label className="dark:text-gray-300">Current Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input {...register('currentPassword')} type={showCurrent ? 'text' : 'password'} 
                  placeholder="Current password" className="pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
            </div>

            <div>
              <Label className="dark:text-gray-300">New Password *</Label>
              <div className="relative">
                <Input {...register('newPassword')} type={showNew ? 'text' : 'password'} 
                  placeholder="New password" className="pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
            </div>

            <div>
              <Label className="dark:text-gray-300">Confirm New Password *</Label>
              <div className="relative">
                <Input {...register('confirmPassword')} type={showConfirm ? 'text' : 'password'} 
                  placeholder="Confirm password" className="pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" disabled={loading || !!(newUsername && newUsername.length >= 4 && usernameAvailable === false)} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}