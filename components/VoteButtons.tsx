'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface VoteButtonsProps {
  proposalId: string;
  votesFor: number;
  votesAgainst: number;
}

export default function VoteButtons({ proposalId, votesFor, votesAgainst }: VoteButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async (support: boolean) => {
    if (hasVoted || loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/governance/proposals/${proposalId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ support }),
      });

      if (response.ok) {
        setHasVoted(true);
        router.refresh();
      } else {
        alert('Failed to submit vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to submit vote');
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = votesFor + votesAgainst;
  const forPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="bg-green-600 transition-all duration-300"
          style={{ width: `${forPercentage}%` }}
        ></div>
        <div
          className="bg-red-600 transition-all duration-300"
          style={{ width: `${100 - forPercentage}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-green-600 font-semibold">{votesFor} For ({forPercentage.toFixed(1)}%)</span>
        <span className="text-red-600 font-semibold">{votesAgainst} Against ({(100 - forPercentage).toFixed(1)}%)</span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => handleVote(true)}
          disabled={hasVoted || loading}
          className="vote-for flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined text-base">thumb_up</span>
          <span>{hasVoted ? 'Voted' : 'Vote For'}</span>
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={hasVoted || loading}
          className="vote-against flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined text-base">thumb_down</span>
          <span>{hasVoted ? 'Voted' : 'Vote Against'}</span>
        </button>
      </div>
    </div>
  );
}
