// src/app/(dashboard)/admin/students/filter-form.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FilterFormProps {
  initialSearch: string;
  initialCourse: string;
  initialStatus: string;
}

export function FilterForm({ initialSearch, initialCourse, initialStatus }: FilterFormProps): React.ReactNode {
  const router = useRouter();
  const [search, setSearch] = useState<string>(initialSearch);
  const [course, setCourse] = useState<string>(initialCourse);
  const [status, setStatus] = useState<string>(initialStatus);

  // Auto-submit when course or status changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (course && course !== 'all') params.set('course', course);
    if (status && status !== 'all') params.set('status', status);
    params.set('page', '1'); // Reset to page 1 on filter change
    
    const queryString = params.toString();
    router.push(`/admin/students${queryString ? `?${queryString}` : ''}`);
  }, [course, status]); // Only auto-submit on select changes, not search typing

  function handleSearchSubmit(e: React.FormEvent): void {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (course && course !== 'all') params.set('course', course);
    if (status && status !== 'all') params.set('status', status);
    params.set('page', '1');
    
    const queryString = params.toString();
    router.push(`/admin/students${queryString ? `?${queryString}` : ''}`);
  }

  function handleClear(): void {
    setSearch('');
    setCourse('all');
    setStatus('all');
    router.push('/admin/students');
  }

  function handleCourseChange(value: string): void {
    setCourse(value === 'all' ? '' : value);
  }

  function handleStatusChange(value: string): void {
    setStatus(value === 'all' ? '' : value);
  }

  const hasFilters = search || (course && course !== 'all') || (status && status !== 'all');

  return (
    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          name="search"
          placeholder="Search students..." 
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      <Select value={course || 'all'} onValueChange={handleCourseChange}>
        <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          <SelectValue placeholder="All Courses" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
          <SelectItem value="all">All Courses</SelectItem>
          <SelectItem value="HIFZ">Hifz</SelectItem>
          <SelectItem value="TAJWEED">Tajweed</SelectItem>
          <SelectItem value="NAZIRAH">Nazirah</SelectItem>
          <SelectItem value="MURAJAAH">Murajaah</SelectItem>
          <SelectItem value="AQIDAH">Aqidah</SelectItem>
          <SelectItem value="FIQH">Fiqh</SelectItem>
          <SelectItem value="HADITH">Hadith</SelectItem>
          <SelectItem value="ARABIC_LANGUAGE">Arabic Language</SelectItem>
          <SelectItem value="ISLAMIC_MANNERS">Islamic Manners</SelectItem>
        </SelectContent>
      </Select>
      <Select value={status || 'all'} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button type="submit" variant="outline" className="w-full sm:w-auto dark:border-gray-700 dark:text-gray-300">
          <Filter className="h-4 w-4 mr-2" />Filter
        </Button>
        {hasFilters && (
          <Button type="button" variant="ghost" onClick={handleClear} className="dark:text-gray-300">
            <X className="h-4 w-4 mr-1" />Clear
          </Button>
        )}
      </div>
    </form>
  );
}