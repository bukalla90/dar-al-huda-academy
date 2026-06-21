// src/app/(dashboard)/admin/applications/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getApplications } from '@/lib/action/application.action';
import { ClipboardList, Check, X, Eye, Mail, Phone, MapPin, User } from 'lucide-react';

export default async function ApplicationsPage(): Promise<React.ReactNode> {
  const result = await getApplications();
  const applications = result.success && result.applications ? result.applications : [];

  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;
  const acceptedCount = applications.filter((a) => a.status === 'ACCEPTED').length;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-white/80 mt-1">Review and manage student applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-3xl font-bold">{applications.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-3xl font-bold">{pendingCount}</p>
              </div>
              <Eye className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Accepted</p>
                <p className="text-3xl font-bold">{acceptedCount}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No applications found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="block lg:hidden space-y-3">
            {applications.map((app) => (
              <Card key={app.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{app.fullName}</h3>
                      <Badge 
                        variant={
                          app.status === 'PENDING' ? 'warning' : 
                          app.status === 'ACCEPTED' ? 'success' : 'destructive'
                        }
                        className="mt-1"
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Age: {app.age}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {app.country}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {app.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {app.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      {app.desiredCourse.replace(/_/g, ' ')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block">
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gradient-to-r from-gray-50 to-white">
                      <th className="text-left py-4 px-6 font-semibold">Name</th>
                      <th className="text-left py-4 px-6 font-semibold">Age</th>
                      <th className="text-left py-4 px-6 font-semibold">Country</th>
                      <th className="text-left py-4 px-6 font-semibold">Contact</th>
                      <th className="text-left py-4 px-6 font-semibold">Course</th>
                      <th className="text-left py-4 px-6 font-semibold">Status</th>
                      <th className="text-left py-4 px-6 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium">{app.fullName}</td>
                        <td className="py-4 px-6">{app.age}</td>
                        <td className="py-4 px-6">{app.country}</td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <p>{app.phone}</p>
                            <p className="text-gray-500">{app.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            {app.desiredCourse.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <Badge 
                            variant={
                              app.status === 'PENDING' ? 'warning' : 
                              app.status === 'ACCEPTED' ? 'success' : 'destructive'
                            }
                          >
                            {app.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}