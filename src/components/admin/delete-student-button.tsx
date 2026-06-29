// src/components/admin/delete-student-button.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteStudent } from '@/lib/action/student.actions';

interface DeleteStudentButtonProps {
  studentId: string;
  studentName: string;
}

export function DeleteStudentButton({ studentId, studentName }: DeleteStudentButtonProps): React.ReactNode {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleDelete(): Promise<void> {
    if (!confirm(`Are you sure you want to delete "${studentName}"? This will also delete their account and all related data.`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteStudent(studentId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete student');
      }
    } catch {
      alert('Failed to delete student');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} disabled={loading}
      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
      title={`Delete ${studentName}`}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}