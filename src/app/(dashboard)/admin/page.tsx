// src/app/(dashboard)/admin/page.tsx
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  Calendar, 
  ClipboardList, 
  BookOpen,
  Activity,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { getChartData, getDashboardStats, getRecentActivity } from '@/lib/action/admin.actions';

function DashboardSkeleton(): React.ReactNode {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-28" />
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: typeof Users;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({ title, value, icon: Icon, gradient, iconBg, iconColor }: StatCardProps): React.ReactNode {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800">
      <div className={`absolute top-0 left-0 right-0 h-1 ${gradient}`} />
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityItemProps {
  type: 'STUDENT' | 'TEACHER' | 'PAYMENT' | 'APPLICATION';
  title: string;
  description: string;
  timestamp: Date;
  status: string;
}

function ActivityItem({ type, title, description, timestamp, status }: ActivityItemProps): React.ReactNode {
  const typeConfig = {
    STUDENT: { dot: 'bg-blue-500', border: 'border-l-blue-500' },
    TEACHER: { dot: 'bg-violet-500', border: 'border-l-violet-500' },
    PAYMENT: { dot: 'bg-green-500', border: 'border-l-green-500' },
    APPLICATION: { dot: 'bg-orange-500', border: 'border-l-orange-500' },
  };

  return (
    <div className={`flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-l-2 ${typeConfig[type].border}`}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">{formatDate(timestamp)}</p>
      </div>
      <Badge variant="outline" className="text-xs shrink-0 dark:border-gray-600 dark:text-gray-300">
        {status}
      </Badge>
    </div>
  );
}

export default async function AdminDashboardPage(): Promise<React.ReactNode> {
  const [statsResult, activityResult, chartResult] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getChartData(),
  ]);

  const stats = statsResult.success ? statsResult.stats : null;
  const activities = activityResult.success && activityResult.activities ? activityResult.activities : [];
  const chartData = chartResult.success ? chartResult.chartData : null;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-6 border border-primary/10 dark:border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening at Dar Al Huda Academy.</p>
          </div>
          <Badge className="bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary-foreground border-0">
            Live
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students" value={stats?.totalStudents ?? 0} icon={Users} gradient="bg-blue-500" iconBg="bg-blue-50 dark:bg-blue-900/40" iconColor="text-blue-600 dark:text-blue-400" />
          <StatCard title="Active Students" value={stats?.activeStudents ?? 0} icon={UserCheck} gradient="bg-emerald-500" iconBg="bg-emerald-50 dark:bg-emerald-900/40" iconColor="text-emerald-600 dark:text-emerald-400" />
          <StatCard title="Total Teachers" value={stats?.totalTeachers ?? 0} icon={GraduationCap} gradient="bg-violet-500" iconBg="bg-violet-50 dark:bg-violet-900/40" iconColor="text-violet-600 dark:text-violet-400" />
          <StatCard title="Paid This Month" value={stats?.paidStudents ?? 0} icon={CreditCard} gradient="bg-green-500" iconBg="bg-green-50 dark:bg-green-900/40" iconColor="text-green-600 dark:text-green-400" />
          <StatCard title="Unpaid" value={stats?.unpaidStudents ?? 0} icon={UserX} gradient="bg-red-500" iconBg="bg-red-50 dark:bg-red-900/40" iconColor="text-red-600 dark:text-red-400" />
          <StatCard title="Upcoming Classes" value={stats?.upcomingClasses ?? 0} icon={Calendar} gradient="bg-cyan-500" iconBg="bg-cyan-50 dark:bg-cyan-900/40" iconColor="text-cyan-600 dark:text-cyan-400" />
          <StatCard title="Total Courses" value={stats?.totalCourses ?? 9} icon={BookOpen} gradient="bg-teal-500" iconBg="bg-teal-50 dark:bg-teal-900/40" iconColor="text-teal-600 dark:text-teal-400" />
        </div>
      </Suspense>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 dark:bg-gray-800">
            <CardHeader className="border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y dark:divide-gray-700 max-h-[400px] overflow-y-auto">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <ActivityItem
                      key={`${activity.type}-${activity.id}`}
                      type={activity.type}
                      title={activity.title}
                      description={activity.description}
                      timestamp={activity.timestamp}
                      status={activity.status}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Activity className="h-10 w-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-lg border-0 dark:bg-gray-800">
            <CardHeader className="border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <BookOpen className="h-5 w-5 text-primary" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {chartData?.courseEnrollment.map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.value / (stats?.totalStudents || 1)) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 dark:bg-gray-800">
            <CardHeader className="border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Payments</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {chartData?.paymentOverview.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}