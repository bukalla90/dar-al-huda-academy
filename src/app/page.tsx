// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  BookOpen,
  Star,
  Users,
  Globe,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  GraduationCap,
  Clock,
  Menu,
  X,
} from 'lucide-react';
import { courses } from '@/data/courses';

export default function HomePage(): React.ReactNode {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const translations = {
    en: {
      home: 'Home',
      about: 'About',
      courses: 'Courses',
      contact: 'Contact',
      login: 'Login',
      dashboard: 'Dashboard',
      heroTitle: 'Learn Quran Online with Qualified Ustazs',
      heroSubtitle: 'Master the recitation, memorization, and understanding of the Holy Quran from the comfort of your home.',
      quranVerse: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
      quranTranslation: '"Read in the name of your Lord who created."',
      quranReference: 'Surah Al-Alaq 96:1',
      quranVerse2: 'رَبِّ زِدْنِي عِلْمًا',
      quranTranslation2: '"My Lord, increase me in knowledge."',
      quranReference2: 'Surah Taha 20:114',
      hadith: '"The best among you are those who learn the Quran and teach it."',
      hadithReference: 'Sahih al-Bukhari',
      whyUs: 'Why Choose Dar Al Huda?',
      ourCourses: 'Our Courses',
      quranPrograms: 'Quran Programs',
      islamicStudies: 'Islamic Studies',
      availableTimes: 'Available Class Times',
      readyToStart: 'Ready to Start Your Quran Journey?',
      readyDesc: 'Contact us to get registered and start learning the Quran with qualified Ustazs.',
      getStarted: 'Contact Us Now',
      howToRegister: 'How to Register',
      howToRegisterDesc: 'Contact us through any of the following methods to get registered. Our admin will create your account and send you login details.',
      footerAbout: 'Dar Al Huda Academy provides quality online Quran education to students worldwide with qualified Ustazs.',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      followUs: 'Follow Us',
      rights: 'All rights reserved.',
    },
    am: {
      home: 'መነሻ',
      about: 'ስለ እኛ',
      courses: 'ኮርሶች',
      contact: 'አድራሻ',
      login: 'ግባ',
      dashboard: 'ዳሽቦርድ',
      heroTitle: 'ከብቁ መምህራን ጋር ቁርአንን በኦንላይን ይማሩ',
      heroSubtitle: 'ከቤትዎ ሆነው የቁርአንን ንባብ፣ ሒፍዝ እና መረዳትን በተደራጀ መንገድ ይማሩ።',
      quranVerse: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
      quranTranslation: '"በፈጠረህ ጌታህ ስም አንብብ።"',
      quranReference: 'ሱረቱ አል-አለቅ 96:1',
      quranVerse2: 'رَبِّ زِدْنِي عِلْمًا',
      quranTranslation2: '"ጌታዬ ሆይ! ዕውቀቴን ጨምርልኝ።"',
      quranReference2: 'ሱረቱ ጣሃ 20:114',
      hadith: '"ከናንተ በላጩ ቁርአንን የተማረና ያስተማረ ነው።"',
      hadithReference: 'ሳሂህ አል-ቡኻሪ',
      whyUs: 'ለምን ዳር አል-ሁዳ?',
      ourCourses: 'የእኛ ኮርሶች',
      quranPrograms: 'የቁርአን ፕሮግራሞች',
      islamicStudies: 'ኢስላሚክ ትምህርቶች',
      availableTimes: 'የሚገኙ የትምህርት ሰዓቶች',
      readyToStart: 'የቁርአን ጉዞዎን ለመጀመር ዝግጁ ነዎት?',
      readyDesc: 'ለመመዝገብ ያግኙንና ከብቁ መምህራን ጋር ቁርአንን መማር ይጀምሩ።',
      getStarted: 'አሁን ያግኙን',
      howToRegister: 'እንዴት መመዝገብ እንደሚቻል',
      howToRegisterDesc: 'ለመመዝገብ ከሚከተሉት መንገዶች በአንዱ ያግኙን። አስተዳዳሪያችን አካውንትዎን ፈጥሮ የመግቢያ መረጃ ይልክልዎታል።',
      footerAbout: 'ዳር አል-ሁዳ አካዳሚ ለተማሪዎች ጥራት ያለው የኦንላይን ቁርአን ትምህርት በብቁ መምህራን ይሰጣል።',
      quickLinks: 'ፈጣን አገናኞች',
      contactUs: 'አድራሻ',
      followUs: 'ይከታተሉን',
      rights: 'መብቱ በህግ የተጠበቀ ነው።',
    },
  };

  const t = translations[language];

  const classTimes = [
    { group: 'Group 1', time: '12:00 PM – 1:30 PM' },
    { group: 'Group 2', time: '3:00 PM – 6:00 PM' },
    { group: 'Group 3', time: '8:00 PM – 9:30 PM' },
    { group: 'Group 4', time: '11:00 PM – 12:00 AM' },
    { group: 'Group 5', time: '1:00 AM – 1:30 AM' },
    { group: 'Group 6', time: '3:00 AM – 5:00 AM' },
  ];

  function getCleanTitle(course: typeof courses[0]): string {
    if (language === 'en') {
      return course.titleEn.replace(/\s*\(.*?\)\s*/g, '').trim();
    }
    return course.titleAm;
  }

  function getCleanDescription(course: typeof courses[0]): string {
    if (language === 'en') {
      return course.descriptionEn;
    }
    return course.descriptionAm;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${isScrolled ? 'text-primary' : 'text-white'}`}>
                Dar Al Huda
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link href="/" className={`text-sm font-medium ${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-accent transition-colors`}>
                {t.home}
              </Link>
              <Link href="#courses" className={`text-sm font-medium ${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-accent transition-colors`}>
                {t.courses}
              </Link>
              <Link href="#about" className={`text-sm font-medium ${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-accent transition-colors`}>
                {t.about}
              </Link>
              <Link href="#contact" className={`text-sm font-medium ${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-accent transition-colors`}>
                {t.contact}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
                className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-accent`}
              >
                <Globe className="h-4 w-4 mr-1" />
                {language === 'en' ? 'አማርኛ' : 'English'}
              </Button>

              {isLoggedIn ? (
                <Link href="/student">
                  <Button className="bg-accent hover:bg-accent/90 text-white">
                    {t.dashboard}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className={`${
                    isScrolled 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30'
                  }`}>
                    {t.login}
                  </Button>
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden"
              >
                {mobileMenuOpen ? (
                  <X className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
                ) : (
                  <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <Link href="/" className="block py-2 text-text font-medium">{t.home}</Link>
              <Link href="#courses" className="block py-2 text-text font-medium">{t.courses}</Link>
              <Link href="#about" className="block py-2 text-text font-medium">{t.about}</Link>
              <Link href="#contact" className="block py-2 text-text font-medium">{t.contact}</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-accent rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="mb-8">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-arabic text-accent mb-4 leading-relaxed">
                {t.quranVerse}
              </p>
              <p className="text-lg sm:text-xl text-white/80 italic">
                {t.quranTranslation}
              </p>
              <p className="text-sm text-white/60 mt-2">{t.quranReference}</p>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mb-10">
              {t.heroSubtitle}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-16">
              {[
                { value: '50+', label: language === 'en' ? 'Students' : 'ተማሪዎች' },
                { value: '5+', label: language === 'en' ? 'Ustazs' : 'መምህራን' },
                { value: '9', label: language === 'en' ? 'Courses' : 'ኮርሶች' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/70 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quran Verses Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-primary/10">
              <div className="text-center">
                <p className="text-4xl sm:text-5xl font-arabic text-primary mb-6 leading-relaxed">
                  {t.quranVerse2}
                </p>
                <p className="text-xl text-text italic mb-4">
                  {t.quranTranslation2}
                </p>
                <Badge variant="outline" className="text-primary border-primary/30">
                  {t.quranReference2}
                </Badge>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-3xl p-8 border border-accent/20">
              <div className="text-center">
                <Star className="h-12 w-12 text-accent mx-auto mb-4" />
                <p className="text-xl sm:text-2xl text-text italic mb-4 leading-relaxed">
                  {t.hadith}
                </p>
                <Badge className="bg-accent/20 text-accent border-0">
                  {t.hadithReference}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">Why Us</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">{t.whyUs}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'We provide quality Islamic education with qualified Ustazs who are passionate about teaching the Quran.'
                : 'ቁርአንን ለማስተማር ፍቅር ያላቸው ብቁ መምህራን ጋር ጥራት ያለው ኢስላሚክ ትምህርት እንሰጣለን።'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: GraduationCap, title: language === 'en' ? 'Qualified Ustazs' : 'ብቁ መምህራን', desc: language === 'en' ? 'Experienced and certified Quran Ustazs' : 'ልምድና ሰርተፊኬት ያላቸው የቁርአን መምህራን' },
              { icon: Clock, title: language === 'en' ? 'Flexible Schedule' : 'ተለዋዋጭ ሰዓት', desc: language === 'en' ? 'Learn at times that suit you best' : 'በሚመችዎት ሰዓት ይማሩ' },
              { icon: Users, title: language === 'en' ? 'One-on-One Classes' : 'የግል ትምህርት', desc: language === 'en' ? 'Personalized attention for each student' : 'ለእያንዳንዱ ተማሪ የግል ትኩረት' },
              { icon: Globe, title: language === 'en' ? 'Worldwide Access' : 'ዓለም አቀፍ', desc: language === 'en' ? 'Learn from anywhere in the world' : 'ከየትኛውም የዓለም ክፍል ይማሩ' },
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 group border-0">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">{t.ourCourses}</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">{t.ourCourses}</h2>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold text-text mb-8 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              {t.quranPrograms}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.filter(c => c.category === 'QURAN').map((course) => (
                <Card key={course.id} className="hover:shadow-xl transition-all duration-300 group border-0 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {getCleanTitle(course)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getCleanDescription(course)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-text mb-8 flex items-center gap-2">
              <Star className="h-6 w-6 text-accent" />
              {t.islamicStudies}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.filter(c => c.category === 'ISLAMIC_STUDIES').map((course) => (
                <Card key={course.id} className="hover:shadow-xl transition-all duration-300 group border-0 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-accent to-primary" />
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      <Star className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {getCleanTitle(course)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getCleanDescription(course)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Class Times */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">{t.availableTimes}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {classTimes.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <Clock className="h-6 w-6 text-primary mx-auto mb-3" />
                <p className="text-sm font-semibold text-primary mb-1">{item.group}</p>
                <p className="text-sm font-medium text-text">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Register */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary mb-4">{t.howToRegister}</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">{t.howToRegister}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t.howToRegisterDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a href="https://wa.me/251914600349" target="_blank" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 h-full">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <MessageCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                  <p className="text-sm text-gray-500 mb-4">+251 91 460 0349</p>
                  <Badge className="bg-green-100 text-green-700 border-0">
                    {language === 'en' ? 'Click to Chat' : 'ለማውራት ይጫኑ'}
                  </Badge>
                </CardContent>
              </Card>
            </a>

            <a href="https://t.me/jemil1456" target="_blank" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 h-full">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <MessageCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Telegram</h3>
                  <p className="text-sm text-gray-500 mb-4">@jemil1456</p>
                  <Badge className="bg-blue-100 text-blue-700 border-0">
                    {language === 'en' ? 'Click to Chat' : 'ለማውራት ይጫኑ'}
                  </Badge>
                </CardContent>
              </Card>
            </a>

            <a href="tel:+251914600349" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 h-full">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {language === 'en' ? 'Phone Call' : 'ስልክ ይደውሉ'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">+251 91 460 0349</p>
                  <p className="text-sm text-gray-500 mb-4">0921757379</p>
                  <Badge className="bg-primary/10 text-primary border-0">
                    {language === 'en' ? 'Click to Call' : 'ለመደወል ይጫኑ'}
                  </Badge>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t.readyToStart}</h2>
          <p className="text-white/80 text-lg mb-8">{t.readyDesc}</p>
          <a href="https://t.me/jemil1456" target="_blank">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-12 py-6 rounded-full shadow-xl">
              {t.getStarted}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Dar Al Huda</span>
              </div>
              <p className="text-gray-400 text-sm">{t.footerAbout}</p>
              <p className="text-gray-500 text-xs mt-3">📍 Dessie, Ethiopia</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.quickLinks}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">{t.home}</Link></li>
                <li><Link href="#courses" className="hover:text-white transition-colors">{t.courses}</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">{t.about}</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">{t.login}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.contactUs}</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> +251 91 460 0349
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> 0921757379
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> mohammedjemal433@gmail.com
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> @jemil1456
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.followUs}</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="https://t.me/+--kQbhPL5J-cyMzU0" target="_blank" className="flex items-center gap-2 hover:text-white transition-colors">
                  <MessageCircle className="h-4 w-4" /> Telegram Group
                </a>
                <a href="https://t.me/jemil1456" target="_blank" className="flex items-center gap-2 hover:text-white transition-colors">
                  <MessageCircle className="h-4 w-4" /> Telegram: @jemil1456
                </a>
                <a href="https://tiktok.com/@jemil123gc" target="_blank" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Users className="h-4 w-4" /> TikTok: @jemil123gc
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Dar Al Huda Academy. {t.rights}
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Developed by Abubeker Oumer
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}