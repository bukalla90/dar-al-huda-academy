// src/app/(dashboard)/admin/students/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createStudent } from '@/lib/action/student.actions';

export default function CreateStudentPage(): React.ReactNode {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    age: '',
    country: '',
    phone: '',
    courseType: '',
    teacherId: '',
    parentName: '',
    parentPhone: '',
    parentWhatsapp: '',
    relationship: '',
  });

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await createStudent({
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      age: parseInt(formData.age),
      country: formData.country,
      phone: formData.phone,
      courseType: formData.courseType as 'HIFZ' | 'TAJWEED' | 'NAZIRAH' | 'MURAJAAH' | 'AQIDAH' | 'FIQH' | 'HADITH' | 'ARABIC_LANGUAGE' | 'ISLAMIC_MANNERS',
      teacherId: formData.teacherId || undefined,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      parentWhatsapp: formData.parentWhatsapp,
      relationship: formData.relationship,
    });

    if (result.success) {
      router.push('/admin/students');
    } else {
      setError(result.error || 'Failed to create student');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-4">
        <Link href="/admin/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add New Student</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Account Info */}
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

            {/* Personal Info */}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Age *</Label>
                  <Input
                    required
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Age"
                  />
                </div>
                <div>
                  <Label>Country *</Label>
                  <Input
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Country"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Course Details</h3>
              <div>
                <Label>Course *</Label>
                <Select
                  value={formData.courseType}
                  onValueChange={(value) => setFormData({ ...formData, courseType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIFZ">Hifz (Qur&apos;an Memorization)</SelectItem>
                    <SelectItem value="TAJWEED">Tajweed</SelectItem>
                    <SelectItem value="NAZIRAH">Nazirah (Qira&apos;ah)</SelectItem>
                    <SelectItem value="MURAJAAH">Muraja&apos;ah (Revision)</SelectItem>
                    <SelectItem value="AQIDAH">Aqidah (Islamic Creed)</SelectItem>
                    <SelectItem value="FIQH">Fiqh (Islamic Jurisprudence)</SelectItem>
                    <SelectItem value="HADITH">Hadith</SelectItem>
                    <SelectItem value="ARABIC_LANGUAGE">Arabic Language</SelectItem>
                    <SelectItem value="ISLAMIC_MANNERS">Islamic Manners & Character</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Guardian Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Guardian Information</h3>
              <div>
                <Label>Guardian Name *</Label>
                <Input
                  required
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="Guardian full name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Relationship *</Label>
                  <Select
                    value={formData.relationship}
                    onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div>
                <Label>WhatsApp *</Label>
                <Input
                  required
                  value={formData.parentWhatsapp}
                  onChange={(e) => setFormData({ ...formData, parentWhatsapp: e.target.value })}
                  placeholder="WhatsApp number"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Student'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}