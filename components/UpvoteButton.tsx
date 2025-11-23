'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UpvoteButtonProps {
  projectId: string;
  initialUpvotes: number;
}

export default function UpvoteButton({ projectId, initialUpvotes }: UpvoteButtonProps) {
  const router = useRouter();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    
    if (hasVoted || loading) return;
    
    setLoading(true);
    // Optimistic update
    setUpvotes(upvotes + 1);
    setHasVoted(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/upvote`, {
        method: 'POST',
      });

      if (!response.ok) {
        // Revert on error
        setUpvotes(upvotes);
        setHasVoted(false);
        alert('Failed to upvote');
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error upvoting:', error);
      setUpvotes(upvotes);
      setHasVoted(false);
      alert('Failed to upvote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={hasVoted || loading}
      className={`flex items-center gap-1.5 rounded-btn px-3 py-1.5 text-sm font-medium transition-all ${
        hasVoted
          ? 'bg-primary-green text-white'
          : 'bg-gray-100 text-body-text hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      <span className={`material-symbols-outlined text-base ${hasVoted ? 'filled' : ''}`}>
        thumb_up
      </span>
      <span>{upvotes}</span>
    </button>
  );
}
