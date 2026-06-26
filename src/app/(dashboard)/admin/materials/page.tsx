// src/app/(dashboard)/admin/materials/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Music, Image, Download, Upload, FolderOpen, X, Loader2, Eye, Trash2 } from 'lucide-react';
import { getMaterials, uploadMaterial, deleteMaterial } from '@/lib/action/material.action';

interface MaterialType {
  id: string;
  title: string;
  fileUrl: string;
  type: string;
  createdAt: Date;
  teacher: { fullName: string };
  student: { fullName: string } | null;
}

export default function MaterialsPage(): React.ReactNode {
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const result = await getMaterials();
    if (result.success && result.materials) {
      setMaterials(result.materials);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

    const result = await uploadMaterial(formData);

    if (result.success) {
      setSuccess('File uploaded successfully!');
      setTitle('');
      setFile(null);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Learning Materials</h1>
            <p className="text-white/80 mt-1">Upload and manage learning resources</p>
          </div>
          <Button onClick={() => setShowUpload(!showUpload)} className="bg-white text-purple-600 hover:bg-white/90">
            <Upload className="h-4 w-4 mr-2" />Upload New
          </Button>
        </div>
      </div>

      {success && <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm">{success}</div>}
      {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">{error}</div>}

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
              <Input value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Tajweed Rules Book" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <Label className="dark:text-gray-300">File * (PDF, Audio, or Image)</Label>
              <Input type="file" accept=".pdf,.mp3,.wav,.png,.jpg,.jpeg,.webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</> : <><Upload className="h-4 w-4 mr-2" />Upload</>}
            </Button>
          </form>
        </Card>
      )}

      {materials.length === 0 ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="py-12 text-center">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No materials uploaded yet</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="block lg:hidden space-y-3">
            {materials.map((material) => {
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
                          <h3 className="font-semibold text-sm dark:text-white truncate">{material.title}</h3>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(material.id)}
                            disabled={deleting === material.id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 -mt-1 -mr-2 shrink-0">
                            {deleting === material.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs dark:border-gray-600 dark:text-gray-300">{material.type}</Badge>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <p>By: {material.teacher.fullName}</p>
                          <p className="text-xs mt-0.5">{new Date(material.createdAt).toLocaleDateString()}</p>
                        </div>
                        <a href={material.fileUrl} target="_blank" className="inline-flex items-center gap-1 text-primary font-medium text-xs mt-2 hover:underline">
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
            {materials.map((material) => {
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
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(material.id)}
                            disabled={deleting === material.id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                            {deleting === material.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Badge variant="outline" className="mt-1 dark:border-gray-600 dark:text-gray-300">{material.type}</Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mb-4">
                      <p>By: {material.teacher.fullName}</p>
                      <p>For: {material.student?.fullName || 'All Students'}</p>
                      <p>{new Date(material.createdAt).toLocaleDateString()}</p>
                    </div>
                    <a href={material.fileUrl} target="_blank" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
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