// src/app/(dashboard)/admin/page.tsx
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  Calendar, 
  ClipboardList, 
  TrendingUp,
  BookOpen,
  Activity,
  DollarSign,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { getChartData, getDashboardStats, getRecentActivity } from '@/lib/action/admin.actions';

// Loading skeleton
function DashboardSkeleton(): React.ReactNode {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-32" />
        ))}
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: typeof Users;
  trend?: string;
  trendUp?: boolean;
  gradient: string;
}

function StatCard({ title, value, description, icon: Icon, trend, trendUp, gradient }: StatCardProps): React.ReactNode {
  return (
    <Card className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 ${gradient}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium text-white/90">
          {title}
        </CardTitle>
        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-white/70">{description}</p>
          {trend && (
            <Badge className="bg-white/20 text-white border-0 text-xs">
              {trendUp ? '↑' : '↓'} {trend}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Activity Item Component
interface ActivityItemProps {
  type: 'STUDENT' | 'TEACHER' | 'PAYMENT' | 'APPLICATION';
  title: string;
  description: string;
  timestamp: Date;
  status: string;
}

function ActivityItem({ type, title, description, timestamp, status }: ActivityItemProps): React.ReactNode {
  const typeConfig = {
    STUDENT: { color: 'bg-blue-100 text-blue-600', icon: Users, dot: 'bg-blue-500' },
    TEACHER: { color: 'bg-purple-100 text-purple-600', icon: GraduationCap, dot: 'bg-purple-500' },
    PAYMENT: { color: 'bg-green-100 text-green-600', icon: DollarSign, dot: 'bg-green-500' },
    APPLICATION: { color: 'bg-orange-100 text-orange-600', icon: ClipboardList, dot: 'bg-orange-500' },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
      <div className={`p-2.5 rounded-xl ${config.color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          <p className="text-sm font-medium text-text truncate">{title}</p>
        </div>
        <p className="text-xs text-gray-500 truncate mt-1">{description}</p>
        <p className="text-xs text-gray-400 mt-2">{formatDate(timestamp)}</p>
      </div>
      <Badge variant="outline" className="text-xs shrink-0 bg-gray-50">
        {status}
      </Badge>
    </div>
  );
}

// Main Dashboard Component
export default async function AdminDashboardPage(): Promise<React.ReactNode> {
  const [statsResult, activityResult, chartResult] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getChartData(),
  ]);

  const stats = statsResult.success ? statsResult.stats : null;
  const activities = activityResult.success ? activityResult.activities : [];
  const chartData = chartResult.success ? chartResult.chartData : null;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-secondary rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Dashboard Overview
            </h1>
            <p className="text-white/80 mt-2 text-sm sm:text-base">
              Welcome back! Here&apos;s what&apos;s happening at Dar Al Huda Academy.
            </p>
          </div>
          <Badge className="bg-white/20 text-white border-0 px-4 py-2">
            <Activity className="h-4 w-4 mr-2" />
            Live
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={stats?.totalStudents ?? 0}
            description="All registered students"
            icon={Users}
            trend="+12%"
            trendUp={true}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Active Students"
            value={stats?.activeStudents ?? 0}
            description="Currently enrolled"
            icon={UserCheck}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Total Teachers"
            value={stats?.totalTeachers ?? 0}
            description="Qualified Ustazs"
            icon={GraduationCap}
            gradient="bg-gradient-to-br from-violet-500 to-purple-600"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${stats?.monthlyRevenue ?? 0}`}
            description="This month's collection"
            icon={DollarSign}
            trend="+15%"
            trendUp={true}
            gradient="bg-gradient-to-br from-amber-500 to-orange-600"
          />
          <StatCard
            title="Paid Students"
            value={stats?.paidStudents ?? 0}
            description="Fully paid this month"
            icon={CreditCard}
            trend="+8%"
            trendUp={true}
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
          />
          <StatCard
            title="Unpaid Students"
            value={stats?.unpaidStudents ?? 0}
            description="Pending payments"
            icon={UserX}
            trend="-5%"
            trendUp={false}
            gradient="bg-gradient-to-br from-red-500 to-rose-600"
          />
          <StatCard
            title="Upcoming Classes"
            value={stats?.upcomingClasses ?? 0}
            description="Scheduled sessions"
            icon={Calendar}
            gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
          />
          <StatCard
            title="Pending Applications"
            value={stats?.pendingApplications ?? 0}
            description="Awaiting review"
            icon={ClipboardList}
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
          />
        </div>
      </Suspense>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-[500px] overflow-y-auto">
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
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent activity to show.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* Course Distribution */}
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Course Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {chartData?.courseEnrollment.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">{item.label}</span>
                      <span className="font-bold text-text">{item.value}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${(item.value / (stats?.totalStudents || 1)) * 100}%`,
                          backgroundColor: item.color,
                          boxShadow: `0 0 10px ${item.color}40`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Overview */}
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-accent" />
                Payment Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {chartData?.paymentOverview.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shadow-lg"
                        style={{ 
                          backgroundColor: item.color,
                          boxShadow: `0 0 8px ${item.color}60`,
                        }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Total Courses */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-primary to-secondary text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-white/80" />
                <p className="text-white/80 text-sm">Total Courses</p>
                <p className="text-4xl font-bold mt-1">{stats?.totalCourses ?? 9}</p>
                <p className="text-white/60 text-xs mt-2">Quran & Islamic Studies</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}