// src/components/courses/course-card.tsx
import { type CourseData } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Mic, BookMarked, RefreshCw, Star, Scale, MessageCircle, Languages, Heart, type LucideIcon } from 'lucide-react';

interface CourseCardProps {
  course: CourseData;
  language: 'en' | 'am';
}

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Mic,
  BookMarked,
  RefreshCw,
  Star,
  Scale,
  MessageCircle,
  Languages,
  Heart,
};

export function CourseCard({ course, language }: CourseCardProps) {
  const Icon = iconMap[course.icon] || BookOpen;
  const title = language === 'en' ? course.titleEn : course.titleAm;
  const description = language === 'en' ? course.descriptionEn : course.descriptionAm;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-lg font-semibold text-text">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}