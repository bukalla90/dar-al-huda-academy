// src/app/(dashboard)/admin/payments/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { getPaymentStatusColor } from '@/lib/utils';
import { CreditCard, Check, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface StudentPayment {
  id: string;
  fullName: string;
  courseType: string;
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    month: string;
  }>;
}

export default function PaymentsPage(): React.ReactNode {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const now = new Date();
  const currentMonth = searchParams.get('month') || String(now.getMonth() + 1).padStart(2, '0');
  const currentYear = searchParams.get('year') || String(now.getFullYear());
  const page = Number(searchParams.get('page')) || 1;

  const [students, setStudents] = useState<StudentPayment[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [paidCount, setPaidCount] = useState<number>(0);
  const [unpaidCount, setUnpaidCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/list?month=${currentMonth}&year=${currentYear}&page=${page}`);
      const data = await res.json();
      
      if (data.success) {
        setStudents(data.students);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        setPaidCount(data.paidCount);
        setUnpaidCount(data.unpaidCount);
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleGo(): void {
    router.push(`/admin/payments?month=${selectedMonth}&year=${selectedYear}`);
  }

  function handleMonthChange(month: string): void {
    setSelectedMonth(month);
  }

  function handleYearChange(year: string): void {
    setSelectedYear(year);
  }

  function getMonthName(month: string): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[parseInt(month) - 1];
  }

  let prevMonth = parseInt(currentMonth) - 1;
  let prevYear = parseInt(currentYear);
  if (prevMonth < 1) { prevMonth = 12; prevYear--; }

  let nextMonth = parseInt(currentMonth) + 1;
  let nextYear = parseInt(currentYear);
  if (nextMonth > 12) { nextMonth = 1; nextYear++; }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track student payments - {getMonthName(currentMonth)} {currentYear}
        </p>
      </div>

      {/* Month Selector */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Link href={`/admin/payments?month=${String(prevMonth).padStart(2, '0')}&year=${prevYear}`}>
              <Button variant="outline" size="icon" className="dark:border-gray-600 dark:text-gray-300">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[150px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue>{getMonthName(selectedMonth)}</SelectValue>
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = String(i + 1).padStart(2, '0');
                    return <SelectItem key={month} value={month}>{getMonthName(month)}</SelectItem>;
                  })}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[110px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue>{selectedYear}</SelectValue>
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = now.getFullYear() - 2 + i;
                    return <SelectItem key={year} value={String(year)}>{year}</SelectItem>;
                  })}
                </SelectContent>
              </Select>

              <Button onClick={handleGo} className="dark:bg-primary">
                Go
              </Button>
            </div>

            <Link href={`/admin/payments?month=${String(nextMonth).padStart(2, '0')}&year=${nextYear}`}>
              <Button variant="outline" size="icon" className="dark:border-gray-600 dark:text-gray-300">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold dark:text-white">{totalCount}</p>
              </div>
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Paid - {getMonthName(currentMonth)}</p>
                <p className="text-2xl font-bold text-green-600">{paidCount}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Unpaid - {getMonthName(currentMonth)}</p>
                <p className="text-2xl font-bold text-red-600">{unpaidCount}</p>
              </div>
              <X className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="block lg:hidden space-y-3">
            {students.map((student) => {
              const payment = student.payments[0];
              return (
                <Card key={student.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold dark:text-white">{student.fullName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{student.courseType.replace(/_/g, ' ')}</p>
                      </div>
                      {payment ? (
                        <Badge className={getPaymentStatusColor(payment.status as 'PAID' | 'UNPAID' | 'PARTIAL' | 'OVERDUE')}>
                          {payment.status}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">UNPAID</Badge>
                      )}
                    </div>
                    {payment && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">ETB {payment.amount}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Student</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Course</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Status - {getMonthName(currentMonth)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const payment = student.payments[0];
                      return (
                        <tr key={student.id} className="border-b dark:border-gray-700 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4 font-medium dark:text-white">{student.fullName}</td>
                          <td className="py-3 px-4 dark:text-gray-300">{student.courseType.replace(/_/g, ' ')}</td>
                          <td className="py-3 px-4 dark:text-gray-300">ETB {payment?.amount || 0}</td>
                          <td className="py-3 px-4">
                            {payment ? (
                              <Badge className={getPaymentStatusColor(payment.status as 'PAID' | 'UNPAID' | 'PARTIAL' | 'OVERDUE')}>
                                {payment.status}
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">UNPAID</Badge>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Link
                href={`/admin/payments?month=${currentMonth}&year=${currentYear}&page=${page - 1}`}
                className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
              >
                <Button variant="outline" size="sm" disabled={page <= 1} className="dark:border-gray-600 dark:text-gray-300">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link key={pageNum} href={`/admin/payments?month=${currentMonth}&year=${currentYear}&page=${pageNum}`}>
                  <Button variant={pageNum === page ? 'default' : 'outline'} size="sm" className={pageNum === page ? '' : 'dark:border-gray-600 dark:text-gray-300'}>
                    {pageNum}
                  </Button>
                </Link>
              ))}
              <Link
                href={`/admin/payments?month=${currentMonth}&year=${currentYear}&page=${page + 1}`}
                className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
              >
                <Button variant="outline" size="sm" disabled={page >= totalPages} className="dark:border-gray-600 dark:text-gray-300">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}