// src/components/admin/delete-student-button.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteStudent } from '@/lib/action/student.actions';

interface DeleteStudentButtonProps {
  studentId: string;
  studentName: string;
}

export function DeleteStudentButton({ studentId, studentName }: DeleteStudentButtonProps): React.ReactNode {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleDelete(): Promise<void> {
    setLoading(true);
    try {
      const result = await deleteStudent(studentId);
      if (result.success) {
        setOpen(false);
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
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        title={`Delete ${studentName}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-center text-xl dark:text-white">Delete Student</DialogTitle>
            <DialogDescription className="text-center dark:text-gray-400">
              Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{studentName}</strong>? 
              This will permanently delete their account, progress records, payments, and all associated data. 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}
              className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...</>
              ) : (
                <><Trash2 className="h-4 w-4 mr-2" /> Delete Permanently</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}