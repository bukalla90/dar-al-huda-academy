// src/app/(dashboard)/admin/students/create/page.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { createStudent } from '@/lib/action/student.actions';

const studentSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  age: z.string().min(1, 'Age is required').refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 4, 'Age must be at least 4'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(7, 'Phone number must be at least 7 digits'),
  courseType: z.string().min(1, 'Please select a course'),
  parentName: z.string().min(2, 'Guardian name is required'),
  parentPhone: z.string().min(7, 'Guardian phone is required'),
  parentWhatsapp: z.string().min(7, 'Contact number is required'),
  relationship: z.string().min(1, 'Please select relationship'),
});

type StudentFormData = z.infer<typeof studentSchema>;

export default function CreateStudentPage(): React.ReactNode {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const courseType = watch('courseType');
  const relationship = watch('relationship');

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

  async function onSubmit(data: StudentFormData): Promise<void> {
    setLoading(true);
    setError('');

    const result = await createStudent({
      username: data.username,
      password: data.password,
      fullName: data.fullName,
      age: parseInt(data.age),
      country: data.country,
      phone: data.phone,
      courseType: data.courseType as 'HIFZ' | 'TAJWEED' | 'NAZIRAH' | 'MURAJAAH' | 'AQIDAH' | 'FIQH' | 'HADITH' | 'ARABIC_LANGUAGE' | 'ISLAMIC_MANNERS',
      teacherId: undefined,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      parentWhatsapp: data.parentWhatsapp,
      relationship: data.relationship,
    });

    if (result.success) {
      router.push('/admin/students');
    } else {
      setError(result.error || 'Failed to create student');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0 min-h-screen bg-white dark:bg-gray-950">
      <div className="flex items-center gap-4">
        <Link href="/admin/students">
          <Button variant="ghost" size="icon" className="dark:hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5 dark:text-gray-300" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Student</h1>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">{error}</div>
            )}

            {/* Account Info */}
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

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
              <div>
                <Label className="dark:text-gray-300">Full Name *</Label>
                <Input {...register('fullName')} placeholder="Enter full name" autoComplete="off" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="dark:text-gray-300">Age *</Label>
                  <Input {...register('age')} type="number" placeholder="Age" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                </div>
                <div>
                  <Label className="dark:text-gray-300">Country *</Label>
                  <Input {...register('country')} placeholder="Country" autoComplete="off" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                </div>
                <div>
                  <Label className="dark:text-gray-300">Phone *</Label>
                  <Input {...register('phone')} placeholder="Phone number" autoComplete="off" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Course Details</h3>
              <div>
                <Label className="dark:text-gray-300">Course *</Label>
                <Select value={courseType || ''} onValueChange={(value) => setValue('courseType', value, { shouldValidate: true })}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="HIFZ">Hifz</SelectItem>
                    <SelectItem value="TAJWEED">Tajweed</SelectItem>
                    <SelectItem value="NAZIRAH">Nazirah</SelectItem>
                    <SelectItem value="MURAJAAH">Muraja&apos;ah</SelectItem>
                    <SelectItem value="AQIDAH">Aqidah</SelectItem>
                    <SelectItem value="FIQH">Fiqh</SelectItem>
                    <SelectItem value="HADITH">Hadith</SelectItem>
                    <SelectItem value="ARABIC_LANGUAGE">Arabic Language</SelectItem>
                    <SelectItem value="ISLAMIC_MANNERS">Islamic Manners & Character</SelectItem>
                  </SelectContent>
                </Select>
                {errors.courseType && <p className="text-red-500 text-xs mt-1">{errors.courseType.message}</p>}
              </div>
            </div>

            {/* Guardian Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Guardian Information</h3>
              <div>
                <Label className="dark:text-gray-300">Guardian Name *</Label>
                <Input {...register('parentName')} placeholder="Guardian full name" autoComplete="off" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="dark:text-gray-300">Relationship *</Label>
                  <Select value={relationship || ''} onValueChange={(value) => setValue('relationship', value, { shouldValidate: true })}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship.message}</p>}
                </div>
                <div>
                  <Label className="dark:text-gray-300">Phone *</Label>
                  <Input {...register('parentPhone')} placeholder="Phone number" autoComplete="off" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  {errors.parentPhone && <p className="text-red-500 text-xs mt-1">{errors.parentPhone.message}</p>}
                </div>
              </div>
              <div>
                <Label className="dark:text-gray-300">Telegram / WhatsApp Number *</Label>
                <Input {...register('parentWhatsapp')} placeholder="Telegram or WhatsApp number" autoComplete="off" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.parentWhatsapp && <p className="text-red-500 text-xs mt-1">{errors.parentWhatsapp.message}</p>}
              </div>
            </div>

            <Button type="submit" disabled={loading || usernameAvailable === false} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Student'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}