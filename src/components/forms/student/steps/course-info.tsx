// src/components/forms/student/steps/course-info.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen, GraduationCap, Search } from 'lucide-react';

import { courses } from '@/data/courses';
import { getAllTeachers, TeacherOption } from '@/lib/action/student.actions';


interface FormData {
  courseType: string;
  teacherId: string;
}

interface CourseInfoProps {
  formData: FormData;
  updateFormData: (fields: Partial<FormData>) => void;
}

export function StudentCourseInfo({ formData, updateFormData }: CourseInfoProps): JSX.Element {
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState<boolean>(true);

  useEffect(() => {
    async function loadTeachers(): Promise<void> {
      const result = await getAllTeachers();
      if (result.success && result.teachers) {
        setTeachers(result.teachers);
      }
      setIsLoadingTeachers(false);
    }
    loadTeachers();
  }, []);

  const quranCourses = courses.filter(c => c.category === 'QURAN');
  const islamicCourses = courses.filter(c => c.category === 'ISLAMIC_STUDIES');

  return (
    <div className="space-y-6">
      {/* Course Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Course Selection
        </h3>

        <div className="space-y-2">
          <Label>Select Course *</Label>
          <Select
            value={formData.courseType}
            onValueChange={(value) => updateFormData({ courseType: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a course" />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
                Quran Programs
              </div>
              {quranCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.titleEn}
                </SelectItem>
              ))}
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase mt-2">
                Islamic Studies
              </div>
              {islamicCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.titleEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Preview */}
        {formData.courseType && (
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <p className="text-sm font-medium text-primary">
              {courses.find(c => c.id === formData.courseType)?.titleEn}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {courses.find(c => c.id === formData.courseType)?.descriptionEn}
            </p>
          </div>
        )}
      </div>

      {/* Teacher Assignment */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Teacher Assignment
        </h3>

        <div className="space-y-2">
          <Label>Assign Teacher (Optional)</Label>
          <Select
            value={formData.teacherId}
            onValueChange={(value) => updateFormData({ teacherId: value })}
            disabled={isLoadingTeachers}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingTeachers ? 'Loading teachers...' : 'Select a teacher'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No teacher assigned</SelectItem>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            You can assign a teacher now or later
          </p>
        </div>
      </div>
    </div>
  );
}