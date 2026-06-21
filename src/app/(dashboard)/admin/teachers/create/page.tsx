// src/app/(dashboard)/admin/teachers/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createTeacher } from '@/lib/action/teacher.actions';

export default function CreateTeacherPage(): React.ReactNode {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    bio: '',
  });

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await createTeacher({
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
    });

    if (result.success) {
      router.push('/admin/teachers');
    } else {
      setError(result.error || 'Failed to create teacher');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-4">
        <Link href="/admin/teachers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add New Teacher</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold">Account Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Username *</Label>
                  <Input
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Label>Password *</Label>
                  <Input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Personal Information</h3>
              <div>
                <Label>Full Name *</Label>
                <Input
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Email *</Label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone"
                  />
                </div>
              </div>
              <div>
                <Label>Bio (Optional)</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief description about the teacher"
                  rows={4}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Teacher'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}