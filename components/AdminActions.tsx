'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AdminActionsProps {
  projectId: string;
}

export default function AdminActions({ projectId }: AdminActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to update project status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update project status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleStatusUpdate('approved')}
        disabled={loading}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-approve-green/10 text-approve-green transition-colors hover:bg-approve-green/20 disabled:opacity-50"
      >
        <span className="material-symbols-outlined filled text-xl!">check</span>
      </button>
      <button
        onClick={() => handleStatusUpdate('rejected')}
        disabled={loading}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-reject-red/10 text-reject-red transition-colors hover:bg-reject-red/20 disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-xl!">close</span>
      </button>
    </div>
  );
}
