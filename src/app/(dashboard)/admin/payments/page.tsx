// src/app/(dashboard)/admin/payments/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { prisma } from '@/lib/prisma';
import { getPaymentStatusColor } from '@/lib/utils';
import { CreditCard, Check, X, AlertTriangle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SearchParams {
  month?: string;
  year?: string;
}

async function getStudentsWithPayments(month: string, year: string) {
  const paymentMonth = `${year}-${month}`;
  
  const students = await prisma.student.findMany({
    include: {
      user: {
        select: {
          isActive: true,
        },
      },
      payments: {
        where: {
          month: paymentMonth,
        },
        take: 1,
      },
    },
    orderBy: { fullName: 'asc' },
  });

  return students;
}

function getMonthName(month: string): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[parseInt(month) - 1];
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<React.ReactNode> {
  const now = new Date();
  const currentMonth = searchParams.month || String(now.getMonth() + 1).padStart(2, '0');
  const currentYear = searchParams.year || String(now.getFullYear());
  
  const students = await getStudentsWithPayments(currentMonth, currentYear);
  
  const paidCount = students.filter(s => s.payments[0]?.status === 'PAID').length;
  const unpaidCount = students.filter(s => !s.payments[0] || s.payments[0]?.status !== 'PAID').length;

  // Previous/Next month
  let prevMonth = parseInt(currentMonth) - 1;
  let prevYear = parseInt(currentYear);
  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear--;
  }
  
  let nextMonth = parseInt(currentMonth) + 1;
  let nextYear = parseInt(currentYear);
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear++;
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-gray-500 mt-1">Track student payments</p>
      </div>

      {/* Month Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Link href={`/admin/payments?month=${String(prevMonth).padStart(2, '0')}&year=${prevYear}`}>
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            
            <div className="flex items-center gap-4">
              <Select defaultValue={currentMonth}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue>{getMonthName(currentMonth)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = String(i + 1).padStart(2, '0');
                    return (
                      <SelectItem key={month} value={month}>
                        {getMonthName(month)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              <Select defaultValue={currentYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue>{currentYear}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = now.getFullYear() - 2 + i;
                    return (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Link href={`/admin/payments?month=${String(nextMonth).padStart(2, '0')}&year=${nextYear}`}>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unpaidCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-3">
        {students.map((student) => {
          const payment = student.payments[0];
          return (
            <Card key={student.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{student.fullName}</h3>
                    <p className="text-sm text-gray-500">{student.courseType.replace(/_/g, ' ')}</p>
                  </div>
                  {payment ? (
                    <Badge className={getPaymentStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      UNPAID
                    </Badge>
                  )}
                </div>
                {payment && (
                  <p className="text-sm text-gray-500 mt-2">
                    Amount: ${payment.amount}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-left py-3 px-4">Course</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const payment = student.payments[0];
                  return (
                    <tr key={student.id} className="border-b">
                      <td className="py-3 px-4 font-medium">{student.fullName}</td>
                      <td className="py-3 px-4">{student.courseType.replace(/_/g, ' ')}</td>
                      <td className="py-3 px-4">${payment?.amount || 0}</td>
                      <td className="py-3 px-4">
                        {payment ? (
                          <Badge className={getPaymentStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            UNPAID
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}