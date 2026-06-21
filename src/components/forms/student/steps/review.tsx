// src/components/forms/student/steps/review.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { courses } from '@/data/courses';
import {
  User,
  BookOpen,
  Users,
  Phone,
  MapPin,
  Hash,
  Heart,
} from 'lucide-react';

interface FormData {
  username: string;
  fullName: string;
  age: string;
  country: string;
  phone: string;
  courseType: string;
  teacherId: string;
  parentName: string;
  parentPhone: string;
  parentWhatsapp: string;
  relationship: string;
}

interface ReviewProps {
  formData: FormData;
}

interface InfoRowProps {
  icon: typeof User;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps): JSX.Element {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-text truncate">{value || 'Not provided'}</p>
      </div>
    </div>
  );
}

export function StudentReview({ formData }: ReviewProps): JSX.Element {
  const selectedCourse = courses.find(c => c.id === formData.courseType);

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800 font-medium">
          ✓ Please review all information before submitting
        </p>
      </div>

      {/* Account Info */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Account Information
          </h3>
          <InfoRow icon={User} label="Username" value={formData.username} />
          <Separator className="my-1" />
          <div className="flex items-start gap-3 py-2">
            <Hash className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Password</p>
              <p className="text-sm font-medium text-text">••••••</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </h3>
          <InfoRow icon={User} label="Full Name" value={formData.fullName} />
          <Separator className="my-1" />
          <InfoRow icon={Hash} label="Age" value={formData.age} />
          <Separator className="my-1" />
          <InfoRow icon={MapPin} label="Country" value={formData.country} />
          <Separator className="my-1" />
          <InfoRow icon={Phone} label="Phone" value={formData.phone} />
        </CardContent>
      </Card>

      {/* Course Info */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Course Details
          </h3>
          <div className="flex items-start gap-3 py-2">
            <BookOpen className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Selected Course</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-medium text-text">
                  {selectedCourse?.titleEn || formData.courseType}
                </p>
                {selectedCourse && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedCourse.category === 'QURAN' ? 'Quran' : 'Islamic Studies'}
                  </Badge>
                )}
              </div>
              {selectedCourse && (
                <p className="text-xs text-gray-600 mt-1">
                  {selectedCourse.descriptionEn}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guardian Info */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Guardian Information
          </h3>
          <InfoRow icon={Users} label="Guardian Name" value={formData.parentName} />
          <Separator className="my-1" />
          <InfoRow icon={Heart} label="Relationship" value={formData.relationship} />
          <Separator className="my-1" />
          <InfoRow icon={Phone} label="Phone" value={formData.parentPhone} />
          <Separator className="my-1" />
          <InfoRow icon={Phone} label="WhatsApp" value={formData.parentWhatsapp} />
        </CardContent>
      </Card>
    </div>
  );
}