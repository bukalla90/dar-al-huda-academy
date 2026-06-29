// src/app/(dashboard)/admin/page.tsx
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, GraduationCap, CreditCard, Calendar, ClipboardList, 
  BookOpen, Activity, UserCheck, UserX, TrendingUp, TrendingDown, DollarSign,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { getChartData, getDashboardStats, getRecentActivity } from '@/lib/action/admin.actions';
import { IncomeBarChart } from '@/components/charts/income-bar-chart';

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
  value: string;
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
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}): Promise<React.ReactNode> {
  const params = await searchParams;
  const selectedYear = params.year || new Date().getFullYear().toString();
  
  const [statsResult, activityResult, chartResult] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getChartData(selectedYear),
  ]);

  const stats = statsResult.success ? statsResult.stats : null;
  const activities = activityResult.success && activityResult.activities ? activityResult.activities : [];
  const chartData = chartResult.success ? chartResult.chartData : null;
  const currentYear = new Date().getFullYear();

  const monthlyIncomeData = chartData?.monthlyIncome?.map(item => ({
    month: item.label,
    income: item.value,
    color: item.color,
  })) || [];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-6 border border-primary/10 dark:border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Dar Al Huda Academy</p>
          </div>
          <Badge className="bg-primary text-white border-0 px-4 py-1.5">
            <Activity className="h-3.5 w-3.5 mr-1.5" />Live
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students" value={String(stats?.totalStudents ?? 0)} icon={Users} gradient="bg-blue-500" iconBg="bg-blue-50 dark:bg-blue-900/40" iconColor="text-blue-600 dark:text-blue-400" />
          <StatCard title="Active Students" value={String(stats?.activeStudents ?? 0)} icon={UserCheck} gradient="bg-emerald-500" iconBg="bg-emerald-50 dark:bg-emerald-900/40" iconColor="text-emerald-600 dark:text-emerald-400" />
          <StatCard title="Total Ustazs" value={String(stats?.totalTeachers ?? 0)} icon={GraduationCap} gradient="bg-violet-500" iconBg="bg-violet-50 dark:bg-violet-900/40" iconColor="text-violet-600 dark:text-violet-400" />
          <StatCard title="Upcoming Classes" value={String(stats?.upcomingClasses ?? 0)} icon={Calendar} gradient="bg-cyan-500" iconBg="bg-cyan-50 dark:bg-cyan-900/40" iconColor="text-cyan-600 dark:text-cyan-400" />
          <StatCard title="Monthly Income" value={`ETB ${(stats?.monthlyIncome ?? 0).toLocaleString()}`} icon={TrendingUp} gradient="bg-green-500" iconBg="bg-green-50 dark:bg-green-900/40" iconColor="text-green-600 dark:text-green-400" />
          <StatCard title="Ustaz Salaries" value={`ETB ${(stats?.teacherSalaries ?? 0).toLocaleString()}`} icon={TrendingDown} gradient="bg-orange-500" iconBg="bg-orange-50 dark:bg-orange-900/40" iconColor="text-orange-600 dark:text-orange-400" />
          <StatCard title="Net Income" value={`ETB ${(stats?.netIncome ?? 0).toLocaleString()}`} icon={DollarSign} gradient={(stats?.netIncome ?? 0) >= 0 ? 'bg-teal-500' : 'bg-red-500'} iconBg={(stats?.netIncome ?? 0) >= 0 ? 'bg-teal-50 dark:bg-teal-900/40' : 'bg-red-50 dark:bg-red-900/40'} iconColor={(stats?.netIncome ?? 0) >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-red-400'} />
          <StatCard title="Paid Students" value={String(stats?.paidStudents ?? 0)} icon={CreditCard} gradient="bg-green-500" iconBg="bg-green-50 dark:bg-green-900/40" iconColor="text-green-600 dark:text-green-400" />
        </div>
      </Suspense>

      {/* Income Bar Chart */}
      <Card className="shadow-lg border-0 dark:bg-gray-800">
        <CardHeader className="border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Income - {selectedYear}
            </CardTitle>
            <form className="flex items-center gap-2">
              <select name="year" defaultValue={selectedYear} className="text-sm border rounded-lg px-3 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((year) => (
                  <option key={year} value={String(year)}>{year}</option>
                ))}
              </select>
              <button type="submit" className="text-sm text-primary hover:underline font-medium">Go</button>
            </form>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <IncomeBarChart data={monthlyIncomeData} />
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Total: <span className="font-bold text-gray-900 dark:text-white">ETB {monthlyIncomeData.reduce((sum, i) => sum + i.income, 0).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Activity & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 dark:bg-gray-800">
            <CardHeader className="border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <Activity className="h-5 w-5 text-primary" />Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y dark:divide-gray-700 max-h-[400px] overflow-y-auto">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.description}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                      </div>
                      <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">{activity.status}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">No recent activity</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-lg border-0 dark:bg-gray-800">
            <CardHeader className="border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />Courses
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
                      <div className="h-full rounded-full" style={{ width: `${(item.value / (stats?.totalStudents || 1)) * 100}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 dark:bg-gray-800">
            <CardHeader className="border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Payment</CardTitle>
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