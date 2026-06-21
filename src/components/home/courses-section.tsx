// src/components/home/courses-section.tsx
import { getQuranCourses, getIslamicStudiesCourses } from '@/data/courses';
import { CourseCard } from '@/components/courses/course-card';

interface CoursesSectionProps {
  language: 'en' | 'am';
}

export function CoursesSection({ language }: CoursesSectionProps) {
  const quranCourses = getQuranCourses();
  const islamicStudiesCourses = getIslamicStudiesCourses();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Quran Programs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-text mb-2">
            {language === 'en' ? 'Quran Programs' : 'የቁርአን ፕሮግራሞች'}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === 'en' 
              ? 'Master the recitation, memorization, and understanding of the Holy Quran'
              : 'የቁርአን ንባብ፣ ሒፍዝ እና መረዳትን በተደራጀ መንገድ ይማሩ'
            }
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quranCourses.map((course) => (
              <CourseCard key={course.id} course={course} language={language} />
            ))}
          </div>
        </div>

        {/* Islamic Studies Programs */}
        <div>
          <h2 className="text-3xl font-bold text-text mb-2">
            {language === 'en' ? 'Islamic Studies' : 'የኢስላሚክ ትምህርቶች'}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === 'en'
              ? 'Comprehensive Islamic education covering Aqeedah, Fiqh, Hadith and more'
              : 'አቂዳ፣ ፊቅህ፣ ሐዲስ እና ሌሎችንም ያካተተ ሁሉን አቀፍ የኢስላሚክ ትምህርት'
            }
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {islamicStudiesCourses.map((course) => (
              <CourseCard key={course.id} course={course} language={language} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}