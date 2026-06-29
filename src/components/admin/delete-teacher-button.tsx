// src/components/admin/delete-teacher-button.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteTeacher } from '@/lib/action/teacher.actions';

interface DeleteTeacherButtonProps {
  teacherId: string;
  teacherName: string;
}

export function DeleteTeacherButton({ teacherId, teacherName }: DeleteTeacherButtonProps): React.ReactNode {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleDelete(): Promise<void> {
    if (!confirm(`Are you sure you want to delete "${teacherName}"? This will also delete their account and cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteTeacher(teacherId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete teacher');
      }
    } catch {
      alert('Failed to delete teacher');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
      title={`Delete ${teacherName}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}