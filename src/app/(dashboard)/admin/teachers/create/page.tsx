// src/app/(dashboard)/admin/teachers/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { createTeacher } from '@/lib/action/teacher.actions';

const teacherSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 digits'),
  bio: z.string().optional(),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export default function CreateTeacherPage(): React.ReactNode {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
  });

  async function checkUsername(username: string): Promise<void> {
    if (username.length < 4) {
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

  async function onSubmit(data: TeacherFormData): Promise<void> {
    setLoading(true);
    setError('');

    const result = await createTeacher(data);

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
          <Button variant="ghost" size="icon" className="dark:hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5 dark:text-gray-300" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Teacher</h1>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Teacher Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">{error}</div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Account Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="dark:text-gray-300">Username *</Label>
                  <Input
                    {...register('username')}
                    placeholder="Enter username"
                    autoComplete="off"
                    onChange={(e) => {
                      register('username').onChange(e);
                      checkUsername(e.target.value);
                    }}
                    className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      usernameAvailable === true ? 'border-green-500 focus:border-green-500' : 
                      usernameAvailable === false ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {checkingUsername && (
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Checking username...
                    </p>
                  )}
                  {usernameAvailable === true && (
                    <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Username is available
                    </p>
                  )}
                  {usernameAvailable === false && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Username is already taken
                    </p>
                  )}
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                </div>
                <div>
                  <Label className="dark:text-gray-300">Password *</Label>
                  <div className="relative">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      autoComplete="new-password"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
              <div>
                <Label className="dark:text-gray-300">Full Name *</Label>
                <Input {...register('fullName')} placeholder="Enter full name" autoComplete="off" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="dark:text-gray-300">Email *</Label>
                  <Input {...register('email')} type="email" placeholder="Enter email" autoComplete="off" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label className="dark:text-gray-300">Phone *</Label>
                  <Input {...register('phone')} placeholder="Enter phone" autoComplete="off" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <div>
                <Label className="dark:text-gray-300">Bio (Optional)</Label>
                <Textarea {...register('bio')} placeholder="Brief description about the teacher" rows={4} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>

            <Button type="submit" disabled={loading || usernameAvailable === false} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Teacher'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}