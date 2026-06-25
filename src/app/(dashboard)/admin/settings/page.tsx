// src/app/(dashboard)/admin/settings/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Save, Lock, Key, Search, CheckCircle, Copy, Loader2, Eye, EyeOff 
} from 'lucide-react';

// Schema for admin's own password change
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function AdminSettingsPage(): React.ReactNode {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // Reset user password states
  const [resetUsername, setResetUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Change admin's own password
  async function onChangePassword(data: ChangePasswordForm): Promise<void> {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        reset();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to change password' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  }

  // Reset a user's password (admin function)
  async function handleResetPassword(): Promise<void> {
    if (!resetUsername || !newPassword) return;

    setResetLoading(true);
    setResetMessage('');

    try {
      const res = await fetch('/api/admin/reset-user-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: resetUsername, newPassword }),
      });

      const result = await res.json();

      if (result.success) {
        setResetMessage(`Password for "${resetUsername}" has been reset successfully!`);
        setCopied(false);
      } else {
        setResetMessage(`Error: ${result.error || 'Failed to reset password'}`);
      }
    } catch {
      setResetMessage('Error: Something went wrong');
    } finally {
      setResetLoading(false);
    }
  }

  function copyToClipboard(): void {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account and system settings</p>
      </div>

      {/* Change Own Password */}
      <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="border-b dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
            <Lock className="h-5 w-5 text-primary" />
            Change Your Password
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
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
              <Label className="dark:text-gray-300">Current Password</Label>
              <div className="relative">
                <Input 
                  {...register('currentPassword')}
                  type={showCurrent ? 'text' : 'password'} 
                  placeholder="Enter current password" 
                  className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10" 
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
            </div>

            <div>
              <Label className="dark:text-gray-300">New Password</Label>
              <div className="relative">
                <Input 
                  {...register('newPassword')}
                  type={showNew ? 'text' : 'password'} 
                  placeholder="Enter new password" 
                  className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10" 
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
            </div>

            <div>
              <Label className="dark:text-gray-300">Confirm New Password</Label>
              <div className="relative">
                <Input 
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'} 
                  placeholder="Confirm new password" 
                  className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10" 
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-secondary text-white w-full rounded-xl">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Reset User Password */}
      <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="border-b dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
            <Key className="h-5 w-5 text-accent" />
            Reset User Password
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              When a student or teacher forgets their password, use this form to reset it. 
              Then share the new password with them via phone or WhatsApp.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="dark:text-gray-300">Username to Reset</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Enter student or teacher username"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  className="pl-10 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <Label className="dark:text-gray-300">New Password</Label>
              <div className="flex gap-2">
                <Input 
                  type="text"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-xl flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <Button 
                  variant="outline"
                  onClick={() => setNewPassword(Math.random().toString(36).slice(-8))}
                  className="rounded-xl dark:border-gray-600 dark:text-gray-300"
                >
                  Generate
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleResetPassword}
              disabled={!resetUsername || !newPassword || resetLoading}
              className="w-full bg-gradient-to-r from-accent to-orange-500 text-white rounded-xl"
            >
              {resetLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
              {resetLoading ? 'Resetting...' : 'Reset Password'}
            </Button>

            {resetMessage && (
              <div className={`rounded-xl p-4 ${
                resetMessage.startsWith('Error') 
                  ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800' 
                  : 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
              }`}>
                <div className="flex items-start gap-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 ${resetMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium mb-1 ${resetMessage.startsWith('Error') ? 'text-red-800 dark:text-red-300' : 'text-green-800 dark:text-green-300'}`}>
                      {resetMessage.startsWith('Error') ? 'Reset Failed' : 'Password Reset Successful!'}
                    </p>
                    {!resetMessage.startsWith('Error') && (
                      <>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          New password: <strong className="text-lg">{newPassword}</strong>
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                          Share this password with {resetUsername} via phone or WhatsApp. They should change it after logging in.
                        </p>
                      </>
                    )}
                  </div>
                  {!resetMessage.startsWith('Error') && (
                    <Button variant="outline" size="sm" onClick={copyToClipboard}
                      className="shrink-0 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50">
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}