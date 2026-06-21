// src/components/student/payment-status.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPaymentStatusColor } from '@/lib/utils';
import { Check, X, AlertTriangle, Clock } from 'lucide-react';
import type { PaymentStatus } from '@/types';

interface PaymentStatusViewProps {
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    month: string;
    status: PaymentStatus;
    notes: string | null;
    createdAt: Date;
  }>;
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

export function PaymentStatusView({ payments, language }: PaymentStatusViewProps) {
  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          {language === 'en' 
            ? 'No payment records found.' 
            : 'ምንም የክፍያ መረጃ አልተገኘም።'
          }
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => {
        const StatusIcon = statusIcons[payment.status];
        return (
          <Card key={payment.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {payment.month}
                </CardTitle>
                <Badge className={getPaymentStatusColor(payment.status)}>
                  <StatusIcon className="w-4 h-4 mr-1" />
                  {language === 'en' 
                    ? statusLabels[payment.status].en 
                    : statusLabels[payment.status].am
                  }
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-text">
                {payment.currency} {payment.amount}
              </p>
              {payment.notes && (
                <p className="text-sm text-gray-600 mt-2">{payment.notes}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(payment.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}