// src/app/(dashboard)/admin/settings/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, User, Lock } from 'lucide-react';

export default function SettingsPage(): React.ReactNode {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
      </div>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div>
              <Label>New Password</Label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Class Times */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Class Schedule Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-4">Available time slots for classes:</p>
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
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-sm">{time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}