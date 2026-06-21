// src/app/(dashboard)/admin/materials/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMaterials } from '@/lib/action/material.action';
import { FileText, Music, Image, Download, Upload, FolderOpen } from 'lucide-react';

export default async function MaterialsPage(): Promise<React.ReactNode> {
  const result = await getMaterials();
  const materials = result.success && result.materials ? result.materials : [];

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

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Learning Materials</h1>
            <p className="text-white/80 mt-1">Upload and manage learning resources</p>
          </div>
          <Button className="bg-white text-purple-600 hover:bg-white/90">
            <Upload className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        </div>
      </div>

      {materials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No materials uploaded yet</p>
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
                <Card key={material.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{material.title}</h3>
                        <Badge variant="outline" className="mt-1">
                          {material.type}
                        </Badge>
                        <div className="text-sm text-gray-500 mt-2">
                          <p>Uploaded by: {material.teacher.fullName}</p>
                          {material.student && (
                            <p>For: {material.student.fullName}</p>
                          )}
                          <p className="text-xs mt-1">
                            {new Date(material.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <a 
                          href={material.fileUrl} 
                          target="_blank"
                          className="inline-flex items-center gap-1 text-primary font-medium text-sm mt-3 hover:underline"
                        >
                          <Download className="h-4 w-4" />
                          Download
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
                <Card key={material.id} className="hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{material.title}</h3>
                        <Badge variant="outline" className="mt-1">
                          {material.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 space-y-1 mb-4">
                      <p>Uploaded by: {material.teacher.fullName}</p>
                      <p>For: {material.student?.fullName || 'All Students'}</p>
                      <p>{new Date(material.createdAt).toLocaleDateString()}</p>
                    </div>

                    <a 
                      href={material.fileUrl} 
                      target="_blank"
                      className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                      <Download className="h-4 w-4" />
                      Download File
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