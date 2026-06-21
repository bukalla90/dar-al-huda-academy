// src/components/forms/student/multi-step-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  BookOpen, 
  Users, 
  Check,
  ChevronLeft,
  ChevronRight,
  Save,
} from 'lucide-react';
import { StudentBasicInfo } from './steps/basic-info';
import { StudentCourseInfo } from './steps/course-info';
import { StudentGuardianInfo } from './steps/guardian-info';
import { StudentReview } from './steps/review';

import type { CreateStudentDTO } from '@/lib/dto/student.dto';
import { toast } from '@/components/ui/use-toast';
import { createStudent } from '@/lib/action/student.actions';

interface FormData {
  username: string;
  password: string;
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

const STEPS = [
  { id: 1, title: 'Basic Information', icon: User },
  { id: 2, title: 'Course Details', icon: BookOpen },
  { id: 3, title: 'Guardian Info', icon: Users },
  { id: 4, title: 'Review', icon: Check },
];

export function MultiStepForm(): JSX.Element {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
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

  const progressPercentage = (currentStep / STEPS.length) * 100;

  function updateFormData(fields: Partial<FormData>): void {
    setFormData(prev => ({ ...prev, ...fields }));
  }

  function handleNext(): void {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBack(): void {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async function handleSubmit(): Promise<void> {
    setIsSubmitting(true);
    
    try {
      const studentData: CreateStudentDTO = {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        age: parseInt(formData.age),
        country: formData.country,
        phone: formData.phone,
        courseType: formData.courseType as CreateStudentDTO['courseType'],
        teacherId: formData.teacherId || undefined,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentWhatsapp: formData.parentWhatsapp,
        relationship: formData.relationship,
      };

      const result = await createStudent(studentData);

      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Student has been created successfully.',
        });
        router.push('/admin/students');
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create student',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderStep(): JSX.Element {
    switch (currentStep) {
      case 1:
        return (
          <StudentBasicInfo
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <StudentCourseInfo
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <StudentGuardianInfo
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return <StudentReview formData={formData} />;
      default:
        return <StudentBasicInfo formData={formData} updateFormData={updateFormData} />;
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps - Mobile */}
      <div className="block lg:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {STEPS[currentStep - 1].title}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Progress Steps - Desktop */}
      <div className="hidden lg:block mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-primary text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isActive ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-20 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {STEPS[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="w-[120px]"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            onClick={handleNext}
            className="w-[120px] bg-primary hover:bg-primary/90"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-[120px] bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              'Saving...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Submit
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}