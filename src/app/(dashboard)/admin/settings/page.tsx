// src/app/(dashboard)/admin/settings/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, Save, Lock, Key, User, Search, CheckCircle, Copy } from 'lucide-react';

export default function AdminSettingsPage(): React.ReactNode {
  const [showResetForm, setShowResetForm] = useState<boolean>(false);
  const [resetUsername, setResetUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [resetMessage, setResetMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  async function handleResetPassword(): Promise<void> {
    // TODO: Call API to reset user password
    // await resetUserPassword({ username: resetUsername, newPassword });
    
    setResetMessage(`Password for "${resetUsername}" has been reset to: ${newPassword}`);
    setCopied(false);
  }

  function copyToClipboard(): void {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and system settings</p>
      </div>

      {/* Change Own Password */}
      <Card className="shadow-lg border-0">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-primary" />
            Change Your Password
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500 mb-4">
            Update your admin account password
          </p>
          <form className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input type="password" placeholder="Enter current password" className="rounded-xl" />
            </div>
            <div>
              <Label>New Password</Label>
              <Input type="password" placeholder="Enter new password" className="rounded-xl" />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="Confirm new password" className="rounded-xl" />
            </div>
            <Button className="bg-gradient-to-r from-primary to-secondary text-white">
              <Save className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Reset User Password */}
      <Card className="shadow-lg border-0">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Key className="h-5 w-5 text-accent" />
            Reset User Password
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              When a student or teacher forgets their password, use this form to reset it. 
              Then share the new password with them via phone or WhatsApp.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Username to Reset</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Enter student or teacher username"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label>New Password</Label>
              <div className="flex gap-2">
                <Input 
                  type="text"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-xl flex-1"
                />
                <Button 
                  variant="outline"
                  onClick={() => setNewPassword(Math.random().toString(36).slice(-8))}
                  className="rounded-xl"
                >
                  Generate
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleResetPassword}
              disabled={!resetUsername || !newPassword}
              className="w-full bg-gradient-to-r from-accent to-orange-500 text-white rounded-xl"
            >
              <Key className="h-4 w-4 mr-2" />
              Reset Password
            </Button>

            {resetMessage && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      Password Reset Successful!
                    </p>
                    <p className="text-sm text-green-700">
                      New password: <strong className="text-lg">{newPassword}</strong>
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Share this password with {resetUsername} via phone or WhatsApp.
                      They should change it after logging in.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="shrink-0 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Class Times */}
      <Card className="shadow-lg border-0">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-primary" />
            Class Schedule Times
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500 mb-4">
            Available time slots for classes:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              '2:00 AM – 4:00 AM',
              '4:00 AM – 6:00 AM',
              '6:00 AM – 8:00 AM',
              '8:00 AM – 10:00 AM',
              '10:00 AM – 12:00 PM',
              '2:00 PM – 4:00 PM',
              '4:00 PM – 6:00 PM',
              '8:00 PM – 10:00 PM',
            ].map((time, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm font-medium">{time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}