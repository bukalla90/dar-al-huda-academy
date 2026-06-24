// src/components/admin/payment-management.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { getPaymentStatusColor } from '@/lib/utils';
import { ChevronDown, Check, X, AlertTriangle, Clock } from 'lucide-react';
import type { PaymentStatus } from '@/types';

interface Payment {
  id: string;
  studentId: string;
  amount: number;
  currency: string;
  month: string;
  status: PaymentStatus;
  notes: string | null;
  student?: {
    fullName: string;
  };
}

interface PaymentManagementProps {
  payments: Payment[];
  language: 'en' | 'am';
}

const statusLabels: Record<PaymentStatus, { en: string; am: string }> = {
  PAID: { en: 'Paid', am: 'ተከፍሏል' },
  UNPAID: { en: 'Unpaid', am: 'አልተከፈለም' },
  PARTIAL: { en: 'Partial', am: 'በከፊል' },
  OVERDUE: { en: 'Overdue', am: 'ያለፈበት' },
};

const statusIcons: Record<PaymentStatus, typeof Check> = {
  PAID: Check,
  UNPAID: X,
  PARTIAL: AlertTriangle,
  OVERDUE: Clock,
};

export function PaymentManagement({ payments, language }: PaymentManagementProps): React.ReactNode {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusUpdate(paymentId: string, newStatus: PaymentStatus): Promise<void> {
    setUpdatingId(paymentId);
    try {
      const response = await fetch('/api/payments/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: paymentId, status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error('Failed to update payment status:', error);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="block lg:hidden">
        {payments.map((payment) => {
          const StatusIcon = statusIcons[payment.status];
          return (
            <div
              key={payment.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 mb-3"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {payment.student?.fullName || 'Unknown Student'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {payment.month} • {payment.currency} {payment.amount}
                  </p>
                </div>
                <Badge className={getPaymentStatusColor(payment.status)}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {language === 'en' 
                    ? statusLabels[payment.status].en 
                    : statusLabels[payment.status].am
                  }
                </Badge>
              </div>
              
              {payment.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{payment.notes}</p>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    disabled={updatingId === payment.id}
                  >
                    {updatingId === payment.id ? (
                      <span>Updating...</span>
                    ) : (
                      <>
                        {language === 'en' ? 'Update Status' : 'ሁኔታ አዘምን'}
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                  <DropdownMenuItem onClick={() => handleStatusUpdate(payment.id, 'PAID')} className="dark:hover:bg-gray-700 dark:text-gray-200">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    {language === 'en' ? 'Paid' : 'ተከፍሏል'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(payment.id, 'UNPAID')} className="dark:hover:bg-gray-700 dark:text-gray-200">
                    <X className="w-4 h-4 mr-2 text-gray-600" />
                    {language === 'en' ? 'Unpaid' : 'አልተከፈለም'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(payment.id, 'PARTIAL')} className="dark:hover:bg-gray-700 dark:text-gray-200">
                    <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                    {language === 'en' ? 'Partial' : 'በከፊል'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(payment.id, 'OVERDUE')} className="dark:hover:bg-gray-700 dark:text-gray-200">
                    <Clock className="w-4 h-4 mr-2 text-red-600" />
                    {language === 'en' ? 'Overdue' : 'ያለፈበት'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Student</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Month</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Amount</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 px-4 text-gray-900 dark:text-white">{payment.student?.fullName}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{payment.month}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {payment.currency} {payment.amount}
                </td>
                <td className="py-3 px-4">
                  <Badge className={getPaymentStatusColor(payment.status)}>
                    {language === 'en' 
                      ? statusLabels[payment.status].en 
                      : statusLabels[payment.status].am
                    }
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        Update
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                      <DropdownMenuItem onClick={() => handleStatusUpdate(payment.id, 'PAID')} className="dark:hover:bg-gray-700 dark:text-gray-200">
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(payment.id, 'UNPAID')} className="dark:hover:bg-gray-700 dark:text-gray-200">
                        <X className="w-4 h-4 mr-2 text-gray-600" />
                        Unpaid
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(payment.id, 'PARTIAL')} className="dark:hover:bg-gray-700 dark:text-gray-200">
                        <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                        Partial
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(payment.id, 'OVERDUE')} className="dark:hover:bg-gray-700 dark:text-gray-200">
                        <Clock className="w-4 h-4 mr-2 text-red-600" />
                        Overdue
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}