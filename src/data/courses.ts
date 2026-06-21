// src/data/courses.ts
import { CourseType, type CourseData } from '@/types';

export const courses: CourseData[] = [
  // Quran Programs
  {
    id: 'HIFZ',
    titleEn: "Hifz (Qur'an Memorization)",
    titleAm: 'ሒፍዝ (Qur\'an Memorization)',
    descriptionEn: 'Memorize the Holy Qur\'an in a structured and organized manner with qualified teachers.',
    descriptionAm: 'ቁርአንን በተደራጀ መንገድ ማስታወስ።',
    icon: 'BookOpen',
    category: 'QURAN',
  },
  {
    id: 'TAJWEED',
    titleEn: 'Tajweed',
    titleAm: 'ተጅዊድ (Tajweed)',
    descriptionEn: 'Learn proper pronunciation of Arabic letters from their correct articulation points and master Tajweed rules.',
    descriptionAm: 'ፊደላትን ከመውጫቸው በትክክል ማንበብ እና የተጅዊድ ህጎችን መማር።',
    icon: 'Mic',
    category: 'QURAN',
  },
  {
    id: 'NAZIRAH',
    titleEn: "Nazirah (Qira'ah)",
    titleAm: 'ነዘሪ (Nazirah/Qira\'ah)',
    descriptionEn: 'Learn to read the Qur\'an correctly from the Mushaf with proper recitation techniques.',
    descriptionAm: 'ቁርአንን በትክክል ከሙስሐፍ ማንበብ።',
    icon: 'BookMarked',
    category: 'QURAN',
  },
  {
    id: 'MURAJAAH',
    titleEn: "Muraja'ah (Revision)",
    titleAm: 'ሙራጃዓ (Muraja\'ah)',
    descriptionEn: 'Regular review and reinforcement of memorized portions to ensure long-term retention.',
    descriptionAm: 'የተማሩትን በየጊዜው መድገም እና ማጠናከር።',
    icon: 'RefreshCw',
    category: 'QURAN',
  },
  
  // Islamic Studies Programs
  {
    id: 'AQIDAH',
    titleEn: 'Aqidah (Islamic Creed)',
    titleAm: 'አቂዳ (Aqidah)',
    descriptionEn: 'Study fundamental Islamic beliefs and creed based on the Qur\'an and Sunnah.',
    descriptionAm: 'መሠረታዊ የእምነት ትምህርቶች።',
    icon: 'Star',
    category: 'ISLAMIC_STUDIES',
  },
  {
    id: 'FIQH',
    titleEn: 'Fiqh (Islamic Jurisprudence)',
    titleAm: 'ፊቅህ (Fiqh)',
    descriptionEn: 'Learn basic Islamic rulings and worship practices according to authentic sources.',
    descriptionAm: 'መሠረታዊ የኢስላም ሕግ እና ኢባዳዎች።',
    icon: 'Scale',
    category: 'ISLAMIC_STUDIES',
  },
  {
    id: 'HADITH',
    titleEn: 'Hadith (Prophetic Traditions)',
    titleAm: 'ሐዲስ (Hadith)',
    descriptionEn: 'Study the sayings and actions of Prophet Muhammad ﷺ to understand and implement the Sunnah.',
    descriptionAm: 'የነቢዩ ﷺ ንግግሮችና ተግባራት።',
    icon: 'MessageCircle',
    category: 'ISLAMIC_STUDIES',
  },
  {
    id: 'ARABIC_LANGUAGE',
    titleEn: 'Arabic Language',
    titleAm: 'አረብኛ ቋንቋ (Arabic Language)',
    descriptionEn: 'Learn the Arabic language to understand the Qur\'an and Islamic texts directly.',
    descriptionAm: 'የአረብኛ ቋንቋ ትምህርት።',
    icon: 'Languages',
    category: 'ISLAMIC_STUDIES',
  },
  {
    id: 'ISLAMIC_MANNERS',
    titleEn: 'Islamic Manners & Character (Adab & Akhlaq)',
    titleAm: 'አዳብ እና አኽላቅ (Islamic Manners & Character)',
    descriptionEn: 'Develop Islamic character, ethics, and proper conduct based on Qur\'an and Sunnah.',
    descriptionAm: 'የሙስሊም ስነምግባርና ሥነ-ምግባር።',
    icon: 'Heart',
    category: 'ISLAMIC_STUDIES',
  },
];

// Helper functions
export function getCoursesByCategory(category: 'QURAN' | 'ISLAMIC_STUDIES'): CourseData[] {
  return courses.filter(course => course.category === category);
}

export function getQuranCourses(): CourseData[] {
  return getCoursesByCategory('QURAN');
}

export function getIslamicStudiesCourses(): CourseData[] {
  return getCoursesByCategory('ISLAMIC_STUDIES');
}

export function getCourseById(id: CourseType): CourseData | undefined {
  return courses.find(course => course.id === id);
}