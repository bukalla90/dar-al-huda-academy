// src/components/forms/student/steps/guardian-info.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, Phone, Heart } from 'lucide-react';

interface FormData {
  parentName: string;
  parentPhone: string;
  parentWhatsapp: string;
  relationship: string;
}

interface GuardianInfoProps {
  formData: FormData;
  updateFormData: (fields: Partial<FormData>) => void;
}

export function StudentGuardianInfo({ formData, updateFormData }: GuardianInfoProps): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Parent / Guardian Information
        </h3>

        <div className="space-y-2">
          <Label htmlFor="parentName">Guardian Full Name *</Label>
          <Input
            id="parentName"
            placeholder="Enter guardian's full name"
            value={formData.parentName}
            onChange={(e) => updateFormData({ parentName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship">Relationship *</Label>
          <Select
            value={formData.relationship}
            onValueChange={(value) => updateFormData({ relationship: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Father">Father</SelectItem>
              <SelectItem value="Mother">Mother</SelectItem>
              <SelectItem value="Guardian">Guardian</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentPhone">
            <Phone className="h-4 w-4 inline mr-1" />
            Phone Number *
          </Label>
          <Input
            id="parentPhone"
            type="tel"
            placeholder="Enter guardian's phone number"
            value={formData.parentPhone}
            onChange={(e) => updateFormData({ parentPhone: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentWhatsapp">
            <Phone className="h-4 w-4 inline mr-1" />
            WhatsApp Number *
          </Label>
          <Input
            id="parentWhatsapp"
            type="tel"
            placeholder="Enter WhatsApp number"
            value={formData.parentWhatsapp}
            onChange={(e) => updateFormData({ parentWhatsapp: e.target.value })}
            required
          />
          <p className="text-xs text-gray-500">
            Used for communication and updates about student progress
          </p>
        </div>
      </div>

      <div className="bg-accent/5 rounded-lg p-4 border border-accent/10">
        <div className="flex items-start gap-3">
          <Heart className="h-5 w-5 text-accent mt-0.5" />
          <div>
            <p className="text-sm font-medium text-text">
              Why we need guardian information?
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Guardian contact is essential for:
            </p>
            <ul className="text-xs text-gray-600 mt-1 list-disc list-inside space-y-1">
              <li>Updates on student progress</li>
              <li>Class schedule changes</li>
              <li>Payment reminders</li>
              <li>Emergency communications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}