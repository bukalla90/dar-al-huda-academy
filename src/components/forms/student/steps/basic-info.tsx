// src/components/forms/student/steps/basic-info.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Phone, MapPin, Hash } from 'lucide-react';

interface FormData {
  username: string;
  password: string;
  fullName: string;
  age: string;
  country: string;
  phone: string;
}

interface BasicInfoProps {
  formData: FormData;
  updateFormData: (fields: Partial<FormData>) => void;
}

export function StudentBasicInfo({ formData, updateFormData }: BasicInfoProps): JSX.Element {
  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Account Information
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="username">Username *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => updateFormData({ username: e.target.value })}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-gray-500">This will be used to login</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-gray-500">Minimum 6 characters</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          Personal Information
        </h3>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter age"
              value={formData.age}
              onChange={(e) => updateFormData({ age: e.target.value })}
              min="4"
              max="100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="country"
                placeholder="Enter country"
                value={formData.country}
                onChange={(e) => updateFormData({ country: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}