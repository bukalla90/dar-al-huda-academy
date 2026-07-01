// src/app/(dashboard)/admin/materials/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Music, Image, Download, Upload, FolderOpen, X, Loader2, Eye, Trash2, GraduationCap, Globe, Filter } from 'lucide-react';
import { getMaterials, uploadMaterial, deleteMaterial } from '@/lib/action/material.action';

interface MaterialType {
  id: string;
  title: string;
  fileUrl: string;
  type: string;
  courseType: string | null;
  createdAt: Date;
  teacher: { fullName: string };
  student: { fullName: string } | null;
}

const COURSE_TYPES = [
  { value: 'all', label: 'All Courses' },
  { value: 'HIFZ', label: 'Hifz' },
  { value: 'TAJWEED', label: 'Tajweed' },
  { value: 'NAZIRAH', label: 'Nazirah' },
  { value: 'MURAJAAH', label: 'Murajaah' },
  { value: 'AQIDAH', label: 'Aqidah' },
  { value: 'FIQH', label: 'Fiqh' },
  { value: 'HADITH', label: 'Hadith' },
  { value: 'ARABIC_LANGUAGE', label: 'Arabic Language' },
  { value: 'ISLAMIC_MANNERS', label: 'Islamic Manners' },
];

export default function MaterialsPage(): React.ReactNode {
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const result = await getMaterials(filterCourse === 'all' ? undefined : filterCourse);
    if (result.success && result.materials) {
      setMaterials(result.materials);
    }
    setLoading(false);
  }, [filterCourse]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter materials client-side for display
  const filteredMaterials = useMemo(() => {
    if (filterCourse === 'all') return materials;
    return materials.filter(m => 
      m.courseType === filterCourse || m.courseType === null
    );
  }, [materials, filterCourse]);

  async function handleUpload(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!file || !title) {
      setError('Please provide a title and file');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    
    // Only add courseType if "all" is not selected
    if (selectedCourse !== 'all') {
      formData.append('courseType', selectedCourse);
    }
    // If "all" is selected, courseType will be null (available to all courses)

    const result = await uploadMaterial(formData);

    if (result.success) {
      setSuccess('File uploaded successfully!');
      setTitle('');
      setFile(null);
      setSelectedCourse('all');
      setShowUpload(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Upload failed');
    }
    setUploading(false);
  }

  async function handleDelete(materialId: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this material?')) return;
    
    setDeleting(materialId);
    const result = await deleteMaterial(materialId);
    if (result.success) {
      setSuccess('Material deleted!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to delete');
    }
    setDeleting(null);
  }

  function getCourseBadge(courseType: string | null): React.ReactNode {
    if (!courseType) {
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">
          <Globe className="h-3 w-3 mr-1" /> All Courses
        </Badge>
      );
    }
    
    const course = COURSE_TYPES.find(c => c.value === courseType);
    return (
      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs">
        <GraduationCap className="h-3 w-3 mr-1" /> {course?.label || courseType}
      </Badge>
    );
  }

  const typeIcon: Record<string, typeof FileText> = {
    PDF: FileText,
    AUDIO: Music,
    IMAGE: Image,
  };

  const typeGradient: Record<string, string> = {
    PDF: 'from-red-500 to-rose-500',
    AUDIO: 'from-purple-500 to-violet-500',
    IMAGE: 'from-blue-500 to-cyan-500',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Learning Materials</h1>
            <p className="text-white/80 mt-1">Upload and manage course-specific resources</p>
          </div>
          <Button onClick={() => setShowUpload(!showUpload)} className="bg-white text-purple-600 hover:bg-white/90">
            <Upload className="h-4 w-4 mr-2" />Upload New
          </Button>
        </div>
      </div>

      {success && <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm">{success}</div>}
      {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">{error}</div>}

      {/* Course Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Select value={filterCourse} onValueChange={setFilterCourse}>
            <SelectTrigger className="w-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              {COURSE_TYPES.map((course) => (
                <SelectItem key={course.value} value={course.value}>
                  <div className="flex items-center gap-2">
                    {course.value === 'all' ? (
                      <Globe className="h-4 w-4" />
                    ) : (
                      <GraduationCap className="h-4 w-4" />
                    )}
                    {course.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredMaterials.length} material{filteredMaterials.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <Card className="dark:bg-gray-800 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Upload Material</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowUpload(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label className="dark:text-gray-300">Title *</Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Tajweed Rules Book" 
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              />
            </div>
            
            {/* Course Selection Dropdown */}
            <div>
              <Label className="dark:text-gray-300">Course *</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> All Courses (Available to Everyone)
                    </div>
                  </SelectItem>
                  {COURSE_TYPES.filter(c => c.value !== 'all').map((course) => (
                    <SelectItem key={course.value} value={course.value}>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" /> {course.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Choose "All Courses" to make this material available to every student, or select a specific course
              </p>
            </div>
            
            <div>
              <Label className="dark:text-gray-300">File * (PDF, Audio, or Image)</Label>
              <Input 
                type="file" 
                accept=".pdf,.mp3,.wav,.png,.jpg,.jpeg,.webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              />
            </div>
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</> : <><Upload className="h-4 w-4 mr-2" />Upload</>}
            </Button>
          </form>
        </Card>
      )}

      {filteredMaterials.length === 0 ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="py-12 text-center">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">
              {filterCourse === 'all' 
                ? 'No materials uploaded yet' 
                : 'No materials for this course'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="block lg:hidden space-y-3">
            {filteredMaterials.map((material) => {
              const Icon = typeIcon[material.type] || FileText;
              const gradient = typeGradient[material.type] || 'from-gray-500 to-gray-600';
              return (
                <Card key={material.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm dark:text-white truncate">{material.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">{material.type}</Badge>
                              {getCourseBadge(material.courseType)}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(material.id)}
                            disabled={deleting === material.id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 -mt-1 -mr-2 shrink-0"
                          >
                            {deleting === material.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <p>By: {material.teacher.fullName}</p>
                          {material.student && <p>For: {material.student.fullName}</p>}
                          <p className="text-xs mt-0.5">{new Date(material.createdAt).toLocaleDateString()}</p>
                        </div>
                        <a 
                          href={material.fileUrl} 
                          target="_blank" 
                          className="inline-flex items-center gap-1 text-primary font-medium text-xs mt-2 hover:underline"
                        >
                          {material.type === 'PDF' || material.type === 'IMAGE' ? <><Eye className="h-3 w-3" />View</> : <><Download className="h-3 w-3" />Download</>}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredMaterials.map((material) => {
              const Icon = typeIcon[material.type] || FileText;
              const gradient = typeGradient[material.type] || 'from-gray-500 to-gray-600';
              return (
                <Card key={material.id} className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition-all group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg dark:text-white">{material.title}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(material.id)}
                            disabled={deleting === material.id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            {deleting === material.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">{material.type}</Badge>
                          {getCourseBadge(material.courseType)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mb-4">
                      <p>By: {material.teacher.fullName}</p>
                      {material.student && <p>For: {material.student.fullName}</p>}
                      {!material.student && <p>For: All Students</p>}
                      <p>{new Date(material.createdAt).toLocaleDateString()}</p>
                    </div>
                    <a 
                      href={material.fileUrl} 
                      target="_blank" 
                      className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                      {material.type === 'PDF' || material.type === 'IMAGE' ? <><Eye className="h-4 w-4" />View File</> : <><Download className="h-4 w-4" />Download File</>}
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}