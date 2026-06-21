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
  ChevronRight,
  Play,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Clock,
  MapPin,
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
      teachers: 'Teachers',
      contact: 'Contact',
      login: 'Login',
      dashboard: 'Dashboard',
      heroTitle: 'Learn Quran Online with Qualified Teachers',
      heroSubtitle: 'Master the recitation, memorization, and understanding of the Holy Quran from the comfort of your home.',
      startLearning: 'Start Learning',
      tryFree: 'Try Free Class',
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
      testimonials: 'What Our Students Say',
      readyToStart: 'Ready to Start Your Quran Journey?',
      readyDesc: 'Join thousands of students worldwide who are learning the Quran with qualified teachers.',
      getStarted: 'Get Started Today',
      footerAbout: 'Dar Al Huda Academy provides quality online Quran education to students worldwide with qualified teachers.',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      followUs: 'Follow Us',
      rights: 'All rights reserved.',
    },
    am: {
      home: 'መነሻ',
      about: 'ስለ እኛ',
      courses: 'ኮርሶች',
      teachers: 'መምህራን',
      contact: 'አድራሻ',
      login: 'ግባ',
      dashboard: 'ዳሽቦርድ',
      heroTitle: 'ከብቁ መምህራን ጋር ቁርአንን በኦንላይን ይማሩ',
      heroSubtitle: 'ከቤትዎ ሆነው የቁርአንን ንባብ፣ ሒፍዝ እና መረዳትን በተደራጀ መንገድ ይማሩ።',
      startLearning: 'መማር ጀምር',
      tryFree: 'ነፃ ትምህርት ሞክር',
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
      testimonials: 'ተማሪዎቻችን ምን ይላሉ?',
      readyToStart: 'የቁርአን ጉዞዎን ለመጀመር ዝግጁ ነዎት?',
      readyDesc: 'በዓለም ዙሪያ ካሉ በሺዎች ከሚቆጠሩ ተማሪዎች ጋር ቁርአንን በብቁ መምህራን ይማሩ።',
      getStarted: 'ዛሬ ይጀምሩ',
      footerAbout: 'ዳር አል-ሁዳ አካዳሚ ለተማሪዎች ጥራት ያለው የኦንላይን ቁርአን ትምህርት በብቁ መምህራን ይሰጣል።',
      quickLinks: 'ፈጣን አገናኞች',
      contactUs: 'አድራሻ',
      followUs: 'ይከታተሉን',
      rights: 'መብቱ በህግ የተጠበቀ ነው።',
    },
  };

  const t = translations[language];

  const classTimes = [
    '2:00 AM – 4:00 AM',
    '4:00 AM – 6:00 AM',
    '6:00 AM – 8:00 AM',
    '8:00 AM – 10:00 AM',
    '10:00 AM – 12:00 PM',
    '2:00 PM – 4:00 PM',
    '4:00 PM – 6:00 PM',
    '8:00 PM – 10:00 PM',
  ];

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
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${isScrolled ? 'text-primary' : 'text-white'}`}>
                Dar Al Huda
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <Link href="/" className={`text-sm font-medium ${isScrolled ? 'text-text' : 'text-white'} hover:text-accent transition-colors`}>
                {t.home}
              </Link>
              <Link href="#courses" className={`text-sm font-medium ${isScrolled ? 'text-text' : 'text-white'} hover:text-accent transition-colors`}>
                {t.courses}
              </Link>
              <Link href="#about" className={`text-sm font-medium ${isScrolled ? 'text-text' : 'text-white'} hover:text-accent transition-colors`}>
                {t.about}
              </Link>
              <Link href="#contact" className={`text-sm font-medium ${isScrolled ? 'text-text' : 'text-white'} hover:text-accent transition-colors`}>
                {t.contact}
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
                className={isScrolled ? 'text-text' : 'text-white'}
              >
                <Globe className="h-4 w-4 mr-1" />
                {language === 'en' ? 'አማርኛ' : 'English'}
              </Button>

              {/* Auth Button */}
              {isLoggedIn ? (
                <Link href="/student">
                  <Button className="bg-accent hover:bg-accent/90 text-white">
                    {t.dashboard}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30">
                    {t.login}
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden"
              >
                {mobileMenuOpen ? (
                  <X className={`h-6 w-6 ${isScrolled ? 'text-text' : 'text-white'}`} />
                ) : (
                  <Menu className={`h-6 w-6 ${isScrolled ? 'text-text' : 'text-white'}`} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
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
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-accent rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000" />
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            {/* Quran Verse */}
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all">
                  <Play className="h-5 w-5 mr-2" />
                  {t.tryFree}
                </Button>
              </Link>
              <Link href="#courses">
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 text-lg px-8 py-6 rounded-full">
                  {t.startLearning}
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16">
              {[
                { value: '500+', label: language === 'en' ? 'Students' : 'ተማሪዎች' },
                { value: '20+', label: language === 'en' ? 'Teachers' : 'መምህራን' },
                { value: '50+', label: language === 'en' ? 'Countries' : 'ሀገራት' },
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-8 w-8 text-white/50 rotate-90" />
        </div>
      </section>

      {/* Quran Verses Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Verse Card */}
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

            {/* Hadith Card */}
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
                ? 'We provide quality Islamic education with qualified teachers who are passionate about teaching the Quran.'
                : 'ቁርአንን ለማስተማር ፍቅር ያላቸው ብቁ መምህራን ጋር ጥራት ያለው ኢስላሚክ ትምህርት እንሰጣለን።'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: GraduationCap, title: language === 'en' ? 'Qualified Teachers' : 'ብቁ መምህራን', desc: language === 'en' ? 'Experienced and certified Quran teachers' : 'ልምድና ሰርተፊኬት ያላቸው የቁርአን መምህራን' },
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

          {/* Quran Programs */}
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
                      {language === 'en' ? course.titleEn : course.titleAm}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? course.descriptionEn : course.descriptionAm}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Islamic Studies */}
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
                      {language === 'en' ? course.titleEn : course.titleAm}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? course.descriptionEn : course.descriptionAm}
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {classTimes.map((time, index) => (
              <div key={index} className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-text">{time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t.readyToStart}</h2>
          <p className="text-white/80 text-lg mb-8">{t.readyDesc}</p>
          <Link href="/apply">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-12 py-6 rounded-full shadow-xl">
              {t.getStarted}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Dar Al Huda</span>
              </div>
              <p className="text-gray-400 text-sm">{t.footerAbout}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">{t.quickLinks}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">{t.home}</Link></li>
                <li><Link href="#courses" className="hover:text-white transition-colors">{t.courses}</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">{t.about}</Link></li>
                <li><Link href="/apply" className="hover:text-white transition-colors">{t.tryFree}</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">{t.contactUs}</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> +123 456 7890
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> info@daralhuda.com
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> WhatsApp: +123 456 7890
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="font-semibold mb-4">{t.followUs}</h4>
              <div className="flex gap-3">
                {['Facebook', 'Twitter', 'YouTube', 'Telegram'].map((social) => (
                  <div key={social} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                    <span className="text-xs">{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Dar Al Huda Academy. {t.rights}
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}