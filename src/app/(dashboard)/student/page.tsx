// src/app/(dashboard)/student/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, Star, GraduationCap, Calendar, Video,
  TrendingUp, Download, FileText, Music, Image,
  User, Phone, Clock, Quote, Settings, Sparkles,
  Heart, Brain, Lightbulb, Target, Shield, Zap,
  Mic, Users, BookMarked, ExternalLink, Timer,
  CheckCircle, Globe, Filter
} from 'lucide-react';
import Link from 'next/link';

interface MaterialWithCourse {
  id: string;
  title: string;
  fileUrl: string;
  type: string;
  courseType: string | null;
}

interface StudentFull {
  id: string;
  fullName: string;
  courseType: string;
  age: number;
  country: string;
  phone: string;
  scheduleTime: string | null;
  user: { isActive: boolean; username: string };
  teacher: { id: string; fullName: string; phone: string; email: string } | null;
  progress: Array<{
    id: string;
    surah: string;
    ayahFrom: number;
    ayahTo: number;
    score: number;
    notes: string;
    createdAt: string;
    teacher: { fullName: string };
  }>;
  sessions: Array<{
    id: string;
    scheduledAt: string;
    meetingUrl: string;
    status: string;
  }>;
  payments: Array<{
    id: string;
    month: string;
    amount: number;
    status: string;
  }>;
  materials: MaterialWithCourse[];
}

const courseLandings: Record<string, {
  title: string;
  subtitle: string;
  verses: Array<{ ar: string; translation: string; reference: string }>;
  hadith: { ar: string; translation: string; reference: string };
  benefits: Array<{ icon: typeof Heart; title: string; description: string }>;
  tips: string[];
  gradient: string;
  icon: typeof BookOpen;
}> = {
  TAJWEED: {
    title: 'የተጅዊድ (تجويد) ጥቅሞች',
    subtitle: 'Perfect Your Quran Recitation - ቁርአንን በትክክል ማንበብ',
    verses: [
      { ar: 'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا', translation: '"And recite the Quran with measured recitation." - "ቁርኣንንም በቀስታ አንብብ።"', reference: 'Surah Al-Muzzammil 73:4' },
      { ar: 'الَّذِينَ آتَيْنَاهُمُ الْكِتَابَ يَتْلُونَهُ حَقَّ تِلَاوَتِهِ', translation: '"Those who have been given the Book recite it with its true recitation." - "መጽሐፉን የሰጠናቸው ተገቢውን ንባብ ያነቡታል።"', reference: 'Surah Al-Baqarah 2:121' },
    ],
    hadith: { ar: 'الْمَاهِرُ بِالْقُرْآنِ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ', translation: '"The one who is proficient in Quran will be with the noble angels." - "በቁርአን የተካነ ሰው ከተከበሩ መላእክት ጋር ይሆናል።"', reference: 'Sahih Muslim' },
    benefits: [
      { icon: Shield, title: 'ትክክለኛ ንባብ', description: 'ፊደላትን ከትክክለኛ መውጫቸው (መኽረጅ) በማውጣት ስህተትን ይቀንሳል።' },
      { icon: Shield, title: 'የቃላት ትርጉም ጥበቃ', description: 'የንባብ ስህተት የአያቶችን ትርጉም ሊለውጥ ስለሚችል ተጅዊድ ይከላከላል።' },
      { icon: Sparkles, title: 'የቁርአን ውበት', description: 'ንባቡ ጥሩ፣ የተስተካከለ እና ለማዳመጥ ደስ የሚል ይሆናል።' },
      { icon: Target, title: 'ነቢዩን ﷺ መከተል', description: 'ቁርአንን እንደተወረደ እና እንደተነበበ ለማንበብ ይረዳል።' },
      { icon: Heart, title: 'ክሹዕ ይጨምራል', description: 'አንባቢውም ሆነ አድማጩ ከቁርአን ጋር በተሻለ ሁኔታ እንዲገናኝ ያደርጋል።' },
      { icon: Zap, title: 'ለአላህ ቃል ክብር', description: 'ቁርአንን በጥንቃቄና በአክብሮት ማንበብ የእምነት ምልክት ነው።' },
    ],
    tips: ['Practice Makharij daily with a mirror', 'Record and compare your recitation', 'Master one rule per week', 'Focus on Madd rules first', 'Use color-coded Mushaf'],
    gradient: 'from-blue-600 via-blue-500 to-cyan-600',
    icon: Mic,
  },
  HIFZ: {
    title: 'የሒፍዝ ጥቅሞች',
    subtitle: 'Quran Memorization Journey - ቁርአንን በልብ ማስቀመጥ',
    verses: [
      { ar: 'وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ', translation: '"And We have made the Quran easy for remembrance." - "ቁርኣንን ለማስታወስ አመቻችነው፤ ተጠንቃቂም አለን?"', reference: 'Surah Al-Qamar 54:17' },
      { ar: 'بَلْ هُوَ آيَاتٌ بَيِّنَاتٌ فِي صُدُورِ الَّذِينَ أُوتُوا الْعِلْمَ', translation: '"Rather, the Quran is distinct verses within the hearts of those given knowledge." - "አይደለም እርሱ ግልጽ አንቀጾች ነው፤ ዕውቀት በተሰጣቸው ልቦች ውስጥ ያለ።"', reference: 'Surah Al-Ankabut 29:49' },
    ],
    hadith: { ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', translation: '"The best among you are those who learn the Quran and teach it." - "ከናንተ በላጩ ቁርአንን የተማረና ያስተማረ ነው።"', reference: 'Sahih al-Bukhari' },
    benefits: [
      { icon: Clock, title: 'ጊዜን በበጎ ማሳለፍ', description: 'ሒፍዝ ተማሪውን ከከንቱ ነገሮች ያርቃል፤ ጊዜውን በአላህ ቃል እንዲሞላ ያደርገዋል።' },
      { icon: Heart, title: 'የስነ-ምግባር መሻሻል', description: 'ቁርአንን በመሸከም ሰውየው በባህሪው እና በአኗኗሩ ላይ መልካም ለውጥ ያመጣል።' },
      { icon: Brain, title: 'ትርጉም መረዳት', description: 'አያቶችን በተደጋጋሚ ማንበብ ትርጉማቸውን ለማሰላሰል ይረዳል።' },
      { icon: Zap, title: 'ኢባዳ ጥራት', description: 'በሶላትና በሌሎች ኢባዳዎች ውስጥ ብዙ ሱራዎችን መቅራት ያስችላል።' },
      { icon: Users, title: 'መምህር መሆን', description: 'ለሌሎች ማስተማር እና ሰደቃ ጃሪያ ማግኘት ይችላል።' },
      { icon: Star, title: 'የአላህ ልዩ ክብር', description: '"የቁርአን ሰዎች የአላህ ልዩ ወዳጆች ናቸው።" (ሀዲስ)' },
      { icon: Lightbulb, title: 'ብርሃን በዱንያና አኺራ', description: 'ቁርአን ለባለቤቱ መሪ፣ አማካሪ እና በቂያማ ቀን አማላጅ ይሆናል።' },
    ],
    tips: ['Review daily, especially before sleep', 'Listen to your favorite Qari', 'Learn the meaning of each verse', 'Repeat new verses 3 times', 'Connect similar verses together'],
    gradient: 'from-emerald-600 via-teal-500 to-green-600',
    icon: BookMarked,
  },
  MURAJAAH: {
    title: 'የሙራጃዓ (مراجعة) ጥቅሞች',
    subtitle: 'Revision & Strengthening - መድገምና ማጠናከር',
    verses: [
      { ar: 'فَذَكِّرْ إِن نَّفَعَتِ الذِّكْرَىٰ', translation: '"So remind, if the reminder should benefit." - "ማስገንዘብም ብትጠቅም አስገንዝብ።"', reference: 'Surah Al-A\'la 87:9' },
      { ar: 'وَلَقَدْ آتَيْنَاكَ سَبْعًا مِّنَ الْمَثَانِي وَالْقُرْآنَ الْعَظِيمَ', translation: '"We have given you seven of the often repeated and the great Quran." - "ከሚደጋገሙት ሰባትንና ታላቁን ቁርአንን ሰጠንህ።"', reference: 'Surah Al-Hijr 15:87' },
    ],
    hadith: { ar: 'تَعَاهَدُوا الْقُرْآنَ', translation: '"Keep reviewing the Quran, for it slips away faster than camels from their ropes." - "ቁርአንን በየጊዜው ተደጋገሙት፤ ከግመሎች ከማሰሪያቸው በበለጠ ፍጥነት ያመልጣል።"', reference: 'Sahih al-Bukhari' },
    benefits: [
      { icon: Brain, title: 'ሒፍዝን ያጠናክራል', description: 'የተሸመደደው ቁርአን እንዳይረሳ እና በልብ እንዲጸና ያደርጋል።' },
      { icon: Target, title: 'ስህተቶችን ያርማል', description: 'በተደጋጋሚ ሙራጃዓ ሲደረግ ስህተቶች ይታወቃሉ እና ይስተካከላሉ።' },
      { icon: Lightbulb, title: 'የአያቶችን ትርጉም ማሰላሰል', description: 'አያቶችን ደጋግሞ ማንበብ መልዕክታቸውን በጥልቀት ለመረዳት ያግዛል።' },
      { icon: Heart, title: 'ከቁርአን ጋር ግንኙነት', description: 'በየቀኑ ከቁርአን ጋር ግንኙነትን ያጠናክራል።' },
      { icon: Zap, title: 'በሶላት መተማመን', description: 'የተረጋገጠ ሒፍዝ በሶላት ውስጥ ያለ ፍርሃት እንዲቀራ ይረዳል።' },
      { icon: TrendingUp, title: 'ትውስታን ያሳድጋል', description: 'አእምሮን በማሰልጠን የማስታወስ ኃይልን ያጠናክራል።' },
      { icon: Sparkles, title: 'በረከት ያስገኛል', description: 'በቀጣይነት መድገም በረከትን እና የልብ እረፍትን ያመጣል።' },
    ],
    tips: ['Review old lessons before new ones', 'Review after 1, 3, and 7 days', 'Recite reviewed portions in Salah', 'Create a revision schedule', 'Teach others what you know'],
    gradient: 'from-orange-500 via-red-500 to-rose-600',
    icon: TrendingUp,
  },
  NAZIRAH: {
    title: 'የነዞር (النظر) ጥቅሞች',
    subtitle: 'Reading Quran from Mushaf - ቁርአንን ከሙስሐፍ ማንበብ',
    verses: [
      { ar: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ', translation: '"Read in the name of your Lord who created." - "በፈጠረህ ጌታህ ስም አንብብ።"', reference: 'Surah Al-Alaq 96:1' },
      { ar: 'الَّذِينَ آتَيْنَاهُمُ الْكِتَابَ يَتْلُونَهُ حَقَّ تِلَاوَتِهِ', translation: '"Those given the Book recite it with true recitation." - "መጽሐፉን የሰጠናቸው ተገቢውን ንባብ ያነቡታል።"', reference: 'Surah Al-Baqarah 2:121' },
    ],
    hadith: { ar: 'اقرؤوا القرآن فإنه يأتي يوم القيامة شفيعًا لأصحابه', translation: '"Read the Quran, for it will come as an intercessor on Judgment Day." - "ቁርአንን አንብቡ፤ በቂያማ ቀን አማላጅ ሆኖ ይመጣል።"', reference: 'Sahih Muslim' },
    benefits: [
      { icon: BookOpen, title: 'የንባብ ትክክለኛነት', description: 'ቁርአንን ሙስሐፍ እያዩ ማንበብ የንባብ ትክክለኛነትን ያሻሽላል።' },
      { icon: Target, title: 'ለሒፍዝ መሠረት', description: 'ነዞር ለሒፍዝ መሠረት ይሆናል፣ ከቁርአን ጋር ቋሚ ግንኙነት ይፈጥራል።' },
      { icon: Heart, title: 'ንባብ ማጠናከሪያ', description: 'ነዞር የቁርአን ንባብን ያጠናክራል፣ ሒፍዝን ያበረታታል።' },
      { icon: Zap, title: 'የአላህ ቃል ማንበብ', description: 'ቁርአንን ማንበብ ራሱ ትልቅ ኢባዳ ነው።' },
    ],
    tips: ['Read aloud for better pronunciation', 'Follow teacher recordings', 'Practice 15-20 minutes daily', 'Focus on letters before speed', 'Use finger to track verses'],
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-600',
    icon: BookOpen,
  },
  AQIDAH: {
    title: 'የአቂዳ (عقيدة) ጥቅሞች',
    subtitle: 'Islamic Creed - የእምነት መሠረቶች',
    verses: [
      { ar: 'فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا اللَّهُ', translation: '"So know that there is no deity except Allah." - "ከአላህ ሌላ አምላክ እንደሌለ ይወቅ።"', reference: 'Surah Muhammad 47:19' },
      { ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translation: '"Say: He is Allah, the One." - "በላቸው፤ እርሱ አላህ አንድ ነው።"', reference: 'Surah Al-Ikhlas 112:1' },
    ],
    hadith: { ar: 'مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ', translation: '"When Allah intends good for someone, He gives him understanding of the religion." - "አላህ በአንድ ሰው መልካምን ሲሻ በሃይማኖት ያስተውለዋል።"', reference: 'Sahih al-Bukhari' },
    benefits: [
      { icon: Shield, title: 'ትክክለኛ እምነት', description: 'ስለ አላህ፣ መላእክት፣ መጻሕፍት፣ መልክተኞች ትክክለኛውን እምነት ይማራሉ።' },
      { icon: Target, title: 'ከሺርክ መጠበቅ', description: 'ትክክለኛ አቂዳ ከሺርክና ከከሃዲነት ይጠብቃል።' },
      { icon: Brain, title: 'አእምሮን ያበራል', description: 'ትክክለኛ እምነት አእምሮን ያበራል፣ ጥርጣሬን ያስወግዳል።' },
      { icon: Heart, title: 'ልብን ያረጋል', description: 'በአላህ ላይ ትክክለኛ እምነት ልብን ያረጋል፣ ሰላምን ያሰፍናል።' },
    ],
    tips: ['Study from authentic sources only', 'Discuss with your teacher regularly', 'Memorize key proofs from Quran & Sunnah', 'Read books of authentic Aqeedah'],
    gradient: 'from-yellow-600 via-amber-500 to-orange-600',
    icon: Shield,
  },
  FIQH: {
    title: 'የፊቅህ (فقه) ጥቅሞች',
    subtitle: 'Islamic Jurisprudence - የኢስላም ሕግጋት',
    verses: [
      { ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ', translation: '"O you who believe, obey Allah and obey the Messenger." - "እናንተ ያመናችሁ ሆይ! አላህን ተገዙ፤ መልክተኛውንም ተገዙ።"', reference: 'Surah An-Nisa 4:59' },
      { ar: 'وَمَا آتَاكُمُ الرَّسُولُ فَخُذُوهُ وَمَا نَهَاكُمْ عَنْهُ فَانتَهُوا', translation: '"Whatever the Messenger gives you, take it; and whatever he forbids you, abstain from it." - "መልክተኛው የሰጣችሁን ያዙት፤ ከከለከላችሁም ነገር ተከልከሉ።"', reference: 'Surah Al-Hashr 59:7' },
    ],
    hadith: { ar: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ', translation: '"Whoever follows a path seeking knowledge, Allah makes the path to Paradise easy for him." - "ዕውቀትን ለመፈለግ መንገድን የሚከተል ሰው አላህ ወደ ጀነት የሚያደርሰውን መንገድ ያቀልለታል።"', reference: 'Sahih Muslim' },
    benefits: [
      { icon: Target, title: 'ትክክለኛ ኢባዳ', description: 'ኢባዳዎችን በትክክለኛ መንገድ ማድረግን ይማራሉ።' },
      { icon: Shield, title: 'ከስህተት መጠበቅ', description: 'በሃይማኖት ውስጥ ከመሳሳት ይጠብቃል።' },
      { icon: Brain, title: 'ማስረጃን ማወቅ', description: 'የእያንዳንዱን ሕግ ማስረጃ ከቁርአንና ሱናህ ይማራሉ።' },
      { icon: Zap, title: 'የዕለት ተዕለት ሕይወት', description: 'በዕለት ተዕለት ሕይወት ውስጥ ትክክለኛውን የኢስላም አቋም ያውቃሉ።' },
    ],
    tips: ['Learn the evidence behind each ruling', 'Practice what you learn immediately', 'Start with purification and prayer rulings', 'Study with a qualified teacher'],
    gradient: 'from-green-600 via-emerald-500 to-teal-600',
    icon: Target,
  },
  HADITH: {
    title: 'የሐዲስ (حديث) ጥቅሞች',
    subtitle: 'Prophetic Traditions - የነቢዩ ﷺ ትምህርቶች',
    verses: [
      { ar: 'وَمَا يَنطِقُ عَنِ الْهَوَىٰ إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ', translation: '"Nor does he speak from desire. It is not but a revelation revealed." - "ከልቡም አይናገርም፤ እርሱ የሚወረድ ራእይ እንጂ ሌላ አይደለም።"', reference: 'Surah An-Najm 53:3-4' },
      { ar: 'لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ', translation: '"There has certainly been for you in the Messenger of Allah an excellent example." - "ለእናንተ በአላህ መልክተኛ መልካም ምሳሌ አላችሁ።"', reference: 'Surah Al-Ahzab 33:21' },
    ],
    hadith: { ar: 'نَضَّرَ اللَّهُ امْرَأً سَمِعَ مِنَّا حَدِيثًا فَحَفِظَهُ حَتَّى يُبَلِّغَهُ', translation: '"May Allah brighten the face of a person who hears a hadith from us, memorizes it, and conveys it." - "አላህ ከእኛ ሀዲስን ሰምቶ የጠበቀና ያደረሰን ሰው ፊቱን ያብራለት።"', reference: 'Sunan Ibn Majah' },
    benefits: [
      { icon: BookOpen, title: 'ቁርአንን መረዳት', description: 'ሐዲስ ቁርአንን ለመረዳት ያግዛል፤ የቁርአን ተግባራዊ ማብራሪያ ነው።' },
      { icon: Target, title: 'ነቢዩን መከተል', description: 'ነቢዩ ﷺ እንዴት እንደኖሩና እንዳስተማሩ በማወቅ የተሻለ ሙስሊም ይሆናሉ።' },
      { icon: Heart, title: 'ሱናህን መውደድ', description: 'የነቢዩን ሱናህ በማጥናት ለነቢዩ ያለን ፍቅር ይጨምራል።' },
      { icon: Zap, title: 'ተግባራዊ ማድረግ', description: 'የተማሩትን ሐዲስ በዕለት ተዕለት ሕይወት ውስጥ ተግባራዊ ማድረግ ይችላሉ።' },
    ],
    tips: ['Start with short hadith collections', 'Memorize one hadith per week', 'Learn the meaning and context', 'Apply hadith teachings in daily life'],
    gradient: 'from-red-600 via-rose-500 to-pink-600',
    icon: BookOpen,
  },
  ARABIC_LANGUAGE: {
    title: 'የአረብኛ ቋንቋ ጥቅሞች',
    subtitle: 'Arabic Language - የቁርአን ቋንቋ',
    verses: [
      { ar: 'إِنَّا أَنزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ', translation: '"Indeed, We have sent it down as an Arabic Quran that you might understand." - "እኛ ታውቁ ዘንድ ዐረብኛ ቁርአን አድርገን አወረድነው።"', reference: 'Surah Yusuf 12:2' },
      { ar: 'وَهَٰذَا لِسَانٌ عَرَبِيٌّ مُّبِينٌ', translation: '"And this is a clear Arabic language." - "ይህም ግልጽ የሆነ ዐረብኛ ቋንቋ ነው።"', reference: 'Surah An-Nahl 16:103' },
    ],
    hadith: { ar: 'أَحِبُّوا الْعَرَبَ لِثَلَاثٍ: لِأَنِّي عَرَبِيٌّ، وَالْقُرْآنَ عَرَبِيٌّ، وَكَلَامَ أَهْلِ الْجَنَّةِ عَرَبِيٌّ', translation: '"Love the Arabs for three reasons: I am an Arab, the Quran is in Arabic, and the language of Paradise is Arabic." - "አረቦችን በሦስት ምክንያት ውደዱ፤ እኔ አረብ ነኝ፣ ቁርአንም በአረብኛ ነው፣ የጀነትም ቋንቋ አረብኛ ነው።"', reference: 'Hadith' },
    benefits: [
      { icon: Brain, title: 'ቁርአንን መረዳት', description: 'አረብኛ መማር ቁርአንን በቀጥታ ለመረዳት ያስችላል።' },
      { icon: Target, title: 'ኢባዳን ማሻሻል', description: 'በሶላት ውስጥ የሚነበቡትን በመረዳት ክሹዕ ይጨምራል።' },
      { icon: Heart, title: 'የኢስላም ቋንቋ', description: 'አረብኛ የኢስላም ቋንቋ ነው፤ ሃይማኖታችንን በትክክል ለመረዳት ያስችላል።' },
      { icon: Sparkles, title: 'ሰፊ እውቀት', description: 'የኢስላሚክ መጻሕፍትን በቀጥታ ማንበብ ይችላሉ።' },
    ],
    tips: ['Practice daily vocabulary', 'Listen to Arabic recitations', 'Practice speaking with your teacher', 'Read simple Arabic texts regularly'],
    gradient: 'from-sky-600 via-blue-500 to-indigo-600',
    icon: Globe,
  },
  ISLAMIC_MANNERS: {
    title: 'የአዳብና አኽላቅ ጥቅሞች',
    subtitle: 'Islamic Manners & Character - ኢስላሚክ ስነ-ምግባር',
    verses: [
      { ar: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ', translation: '"And indeed, you are of a great moral character." - "አንተም በታላቅ ሥነ-ምግባር ላይ ነህ።"', reference: 'Surah Al-Qalam 68:4' },
      { ar: 'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ', translation: '"Indeed, Allah commands justice and good conduct." - "አላህ በማስተካከልና በማሳመር ያዛል።"', reference: 'Surah An-Nahl 16:90' },
    ],
    hadith: { ar: 'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ', translation: '"I was sent to perfect good character." - "የተላክሁት መልካም ሥነ-ምግባርን ለማጠናቀቅ ነው።"', reference: 'Sahih al-Bukhari' },
    benefits: [
      { icon: Heart, title: 'መልካም ምግባር', description: 'እንደ ነቢዩ ﷺ መልካም ምግባርን ይማራሉ።' },
      { icon: Users, title: 'ከሰዎች ጋር ግንኙነት', description: 'ከቤተሰብ፣ ከጎረቤቶችና ከማህበረሰቡ ጋር በመልካም መንገድ መኖርን ይማራሉ።' },
      { icon: Star, title: 'ነቢዩን መምሰል', description: 'በስነ-ምግባር ነቢዩን በመምሰል በአላህ ዘንድ ደረጃን ያገኛሉ።' },
      { icon: Sparkles, title: 'የተሟላ ሙስሊም', description: 'እውቀትና ምግባር በማጣመር የተሟላ ሙስሊም ይሆናሉ።' },
    ],
    tips: ['Practice good manners daily', 'Be kind to parents and elders', 'Speak gently and truthfully', 'Follow the Sunnah in all matters'],
    gradient: 'from-teal-600 via-cyan-500 to-sky-600',
    icon: Heart,
  },
};

const defaultLanding = {
  title: 'Islamic Studies',
  subtitle: 'Seek knowledge - ዕውቀትን ፈልጉ',
  verses: [{ ar: 'رَبِّ زِدْنِي عِلْمًا', translation: '"My Lord, increase me in knowledge." - "ጌታዬ ሆይ! ዕውቀቴን ጨምርልኝ።"', reference: 'Surah Taha 20:114' }],
  hadith: { ar: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ', translation: '"Seeking knowledge is obligatory upon every Muslim." - "ዕውቀትን መፈለግ በእያንዳንዱ ሙስሊም ላይ ግዴታ ነው።"', reference: 'Sunan Ibn Majah' },
  benefits: [{ icon: Brain, title: 'Study', description: 'Learn consistently' }],
  tips: ['Study daily', 'Ask questions'],
  gradient: 'from-primary to-secondary',
  icon: BookOpen,
};

export default function StudentDashboardPage(): React.ReactNode {
  const [student, setStudent] = useState<StudentFull | null>(null);
  const [generalMaterials, setGeneralMaterials] = useState<MaterialWithCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/student/dashboard');
      const data = await response.json();
      if (data.success) {
        setStudent(data.student);
        setGeneralMaterials(data.generalMaterials || []);
      }
    } catch (error) {
      console.error('Failed to load student data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toDateString(), [today]);

  const todaySessions = useMemo(() => 
    student?.sessions.filter(s => new Date(s.scheduledAt).toDateString() === todayStr) || [],
    [student?.sessions, todayStr]
  );

  const upcomingSessions = useMemo(() => 
    student?.sessions.filter(s => new Date(s.scheduledAt) > today) || [],
    [student?.sessions, today]
  );

  const lastProgress = useMemo(() => student?.progress[0], [student?.progress]);
  
  const typeIcon: Record<string, typeof FileText> = { PDF: FileText, AUDIO: Music, IMAGE: Image };

  function getJoinWindow(session: { scheduledAt: string; meetingUrl: string }): {
    canJoin: boolean;
    timeUntil: string;
    isLive: boolean;
    isCompleted: boolean;
  } {
    const sessionTime = new Date(session.scheduledAt);
    const diffMs = sessionTime.getTime() - currentTime.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < -60) {
      return { canJoin: false, timeUntil: 'Completed', isLive: false, isCompleted: true };
    }
    
    if (diffMinutes <= 0 && diffMinutes >= -60) {
      return { canJoin: true, timeUntil: 'Live now! Click Join', isLive: true, isCompleted: false };
    }
    
    if (diffMinutes <= 15 && diffMinutes > 0) {
      return { canJoin: true, timeUntil: `Starting in ${diffMinutes} min`, isLive: false, isCompleted: false };
    }
    
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return { 
      canJoin: false, 
      timeUntil: hours > 0 ? `Starts in ${hours}h ${mins}m` : `Starts in ${mins}m`, 
      isLive: false,
      isCompleted: false 
    };
  }

  function openZoomLink(meetingUrl: string): void {
    window.open(meetingUrl, '_blank', 'noopener,noreferrer');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">Student not found</p>
        </div>
      </div>
    );
  }

  const landing = courseLandings[student.courseType] || defaultLanding;
  const LandingIcon = landing.icon;

  // Combine and deduplicate materials
  const allMaterials = useMemo(() => {
    const combined = [...(student.materials || []), ...generalMaterials];
    // Remove duplicates by id
    const unique = combined.filter((material, index, self) =>
      index === self.findIndex((m) => m.id === material.id)
    );
    return unique;
  }, [student.materials, generalMaterials]);

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{student.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{student.courseType.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <Link href="/student/settings">
          <Button variant="ghost" size="icon" className="dark:hover:bg-gray-700">
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Button>
        </Link>
      </div>

      {/* LANDING PAGE */}
      <div className={`bg-gradient-to-br ${landing.gradient} rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-24 -mt-24" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-16 -mb-16" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <LandingIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{landing.title}</h1>
              <p className="text-white/70 text-sm mt-1">{landing.subtitle}</p>
            </div>
          </div>
          {landing.verses.map((verse, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-3 border border-white/10">
              <p className="text-xl sm:text-2xl font-arabic text-center mb-2 leading-relaxed">{verse.ar}</p>
              <p className="text-white/80 text-center text-xs italic">{verse.translation}</p>
              <p className="text-white/50 text-center text-xs mt-1">{verse.reference}</p>
            </div>
          ))}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Quote className="h-4 w-4 text-accent" />
              <span className="text-xs text-white/60 uppercase tracking-wide">Hadith / ሐዲስ</span>
            </div>
            <p className="text-white/90 text-xs italic leading-relaxed">{landing.hadith.translation}</p>
            <p className="text-white/50 text-xs mt-1">{landing.hadith.reference}</p>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" /> Benefits / ጥቅሞች
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {landing.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl group">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <benefit.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">{benefit.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-2xl p-5 border border-primary/10 dark:border-primary/20">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" /> Tips to Improve
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {landing.tips.map((tip, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{index + 1}</span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="space-y-4">
          <Card className="shadow-sm border dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 dark:text-white">
                <GraduationCap className="h-5 w-5 text-primary" /> My Teacher (Ustaz)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.teacher ? (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm dark:text-white">{student.teacher.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{student.teacher.phone}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No teacher assigned yet</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 dark:text-white">
                <Clock className="h-5 w-5 text-accent" /> My Daily Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.scheduleTime ? (
                <div className="text-center py-3">
                  <p className="text-3xl font-bold text-primary">{student.scheduleTime}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Everyday</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Schedule not set yet. Your teacher will assign a time.
                </p>
              )}
            </CardContent>
          </Card>

          {lastProgress && (
            <Card className="shadow-sm border dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base dark:text-white">Current Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Surah</span><span className="font-medium dark:text-white">{lastProgress.surah}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Score</span><div className="flex items-center gap-1"><Star className="h-3 w-3 text-accent fill-accent" /><span className="font-medium dark:text-white">{lastProgress.score}/10</span></div></div>
                {lastProgress.notes && <p className="text-xs text-gray-500 italic mt-1">"{lastProgress.notes}"</p>}
              </CardContent>
            </Card>
          )}

          <Card className="shadow-sm border dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2"><CardTitle className="text-base dark:text-white">Progress History</CardTitle></CardHeader>
            <CardContent>
              {student.progress.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {student.progress.slice(0, 5).map((r) => (
                    <div key={r.id} className="flex justify-between items-center p-1.5 bg-gray-50 dark:bg-gray-700/50 rounded text-xs">
                      <span className="dark:text-white">Surah {r.surah}</span>
                      <Badge variant="outline" className="text-xs">{r.score}/10</Badge>
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-gray-500 text-center py-4">No records</p>}
            </CardContent>
          </Card>
        </div>

        {/* Middle - Today's Class with Status */}
        <div className="space-y-4">
          <Card className="shadow-sm border dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 dark:text-white">
                <Video className="h-5 w-5 text-blue-600" /> Today&apos;s Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaySessions.length > 0 ? (
                <div className="space-y-3">
                  {todaySessions.map((session) => {
                    const { canJoin, timeUntil, isLive, isCompleted } = getJoinWindow(session);
                    return (
                      <div key={session.id} className={`p-4 rounded-xl border ${
                        isCompleted ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700' :
                        isLive ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                        canJoin ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                        'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'
                      }`}>
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-gray-500" />
                            ) : isLive ? (
                              <div className="flex items-center gap-1">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                                </span>
                                <Timer className="h-4 w-4 text-green-600" />
                              </div>
                            ) : (
                              <Timer className="h-4 w-4 text-primary" />
                            )}
                            <span className={`text-lg font-bold ${
                              isCompleted ? 'text-gray-500 dark:text-gray-400' :
                              isLive ? 'text-green-600 dark:text-green-400 animate-pulse' : 
                              canJoin ? 'text-blue-600 dark:text-blue-400' : 
                              'text-gray-600 dark:text-gray-400'
                            }`}>
                              {timeUntil}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Scheduled at {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        
                        {isCompleted && (
                          <Button disabled className="w-full" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Class Completed
                          </Button>
                        )}
                        
                        {(canJoin || isLive) && !isCompleted && session.meetingUrl && (
                          <Button 
                            className={`w-full ${isLive ? 'bg-green-600 hover:bg-green-700 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}`}
                            onClick={() => openZoomLink(session.meetingUrl)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {isLive ? 'Join Live Class Now!' : 'Join Zoom Class'}
                          </Button>
                        )}
                        
                        {!canJoin && !isCompleted && (
                          <Button disabled className="w-full" variant="outline">
                            <Clock className="h-4 w-4 mr-2" />
                            {timeUntil}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Calendar className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No class scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 dark:text-white">
                <Calendar className="h-5 w-5 text-accent" /> Upcoming Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-1.5">
                  {upcomingSessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-accent shrink-0" />
                        <div>
                          <span className="dark:text-white font-medium">
                            {new Date(session.scheduledAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">
                            {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      {session.meetingUrl && (
                        <Button size="sm" variant="ghost" className="text-primary h-7 text-xs" onClick={() => openZoomLink(session.meetingUrl)}>
                          <ExternalLink className="h-3 w-3 mr-1" />Zoom
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming classes</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <Card className="shadow-sm border dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 dark:text-white">
                <BookOpen className="h-5 w-5 text-primary" /> Course Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allMaterials.length > 0 ? (
                <div className="space-y-1.5">
                  {allMaterials.slice(0, 5).map((material) => {
                    const Icon = typeIcon[material.type] || FileText;
                    return (
                      <a key={material.id} href={material.fileUrl} target="_blank"
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <Icon className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-xs truncate dark:text-white">{material.title}</span>
                        {material.courseType && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 ml-auto shrink-0">
                            {material.courseType.replace(/_/g, ' ')}
                          </Badge>
                        )}
                        <Download className="h-3 w-3 text-gray-400" />
                      </a>
                    );
                  })}
                </div>
              ) : <p className="text-xs text-gray-500 text-center py-4">No materials</p>}
            </CardContent>
          </Card>

          <Card className="shadow-sm border dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2"><CardTitle className="text-base dark:text-white">Payments</CardTitle></CardHeader>
            <CardContent>
              {student.payments.length > 0 ? (
                <div className="space-y-1.5">
                  {student.payments.slice(0, 4).map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs">
                      <span className="dark:text-white">{payment.month}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 dark:text-gray-400">ETB {payment.amount}</span>
                        <Badge variant={payment.status === 'PAID' ? 'success' : 'warning'} className="text-xs">{payment.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-gray-500 text-center py-4">No records</p>}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-gradient-to-br from-primary to-secondary text-white">
            <CardContent className="pt-4 pb-4 text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-1 text-white/80" />
              <p className="text-xs text-white/70">My Course</p>
              <p className="font-bold text-sm">{student.courseType.replace(/_/g, ' ')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}