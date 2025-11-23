import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import VoteButtons from '@/components/VoteButtons';
import StakeButton from '@/components/StakeButton';

export const dynamic = 'force-dynamic';

async function getGovernanceData() {
  const [activeProposals, passedProposals, stakes] = await Promise.all([
    prisma.proposal.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      include: { createdBy: { select: { name: true } } },
    }),
    prisma.proposal.findMany({
      where: { status: { in: ['passed', 'rejected'] } },
      orderBy: { endsAt: 'desc' },
      take: 3,
      include: { createdBy: { select: { name: true } } },
    }),
    prisma.stake.groupBy({
      by: ['tier'],
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  return { activeProposals, passedProposals, stakes };
}

function getTimeRemaining(endsAt: Date) {
  const now = new Date();
  const diff = endsAt.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `Closes in ${days} day${days > 1 ? 's' : ''}`;
  return 'Closing soon';
}

export default async function GovernancePage() {
  const { activeProposals, passedProposals, stakes } = await getGovernanceData();
  
  // Calculate tier stats
  const validatorStake = stakes.find(s => s.tier === 'validator')?._sum.amount || 0;
  const contributorStake = stakes.find(s => s.tier === 'contributor')?._sum.amount || 0;
  const observerStake = stakes.find(s => s.tier === 'observer')?._sum.amount || 0;
  
  const tiers = [
    { name: 'Validator Tier', apy: 12.5, totalStaked: validatorStake, userStake: 5000, color: 'highlight-validator' },
    { name: 'Contributor Tier', apy: 8.2, totalStaked: contributorStake, userStake: 0, color: 'highlight-contributor' },
    { name: 'Observer Tier', apy: 4.5, totalStaked: observerStake, userStake: 0, color: 'highlight-observer' },
  ];

  return (
    <main className="flex-1 mt-10 px-2 sm:px-6 max-w-[1100px] mx-auto w-full">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <div>
                  <p className="text-forest-green text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] min-w-72">Governance &amp; Rewards</p>
                  <p className="text-sm text-blue-600 mt-2 font-medium">
                    <span className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                      <span className="material-symbols-outlined text-base">info</span>
                      Demo Mode - Web3 wallet integration coming in Phase 2
                    </span>
                  </p>
                </div>
                <div className="text-forest-green/30 opacity-50">
                  <span className="material-symbols-outlined text-8xl">account_balance</span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 @container mb-16">
                <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-white/50 border border-transparent hover:border-highlight-validator transition-all duration-300">
                  <div className="flex w-full flex-col items-stretch justify-center gap-4 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full bg-highlight-validator"></div>
                      <p className="text-sm font-semibold uppercase tracking-wider text-highlight-validator">VALIDATOR TIER</p>
                    </div>
                    <p className="text-forest-green text-4xl font-bold leading-tight tracking-[-0.015em]">12.5% <span className="text-2xl font-medium">APY</span></p>
                    <div className="flex flex-col gap-2 mt-2">
                      <p className="text-text-secondary text-base font-normal leading-normal">Total Staked: $1.2M</p>
                      <p className="text-text-secondary text-base font-normal leading-normal">Your Stake: $5,000</p>
                    </div>
                    <StakeButton tier="validator" apy="12.5%" />
                  </div>
                </div>
                <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-white/50 border border-transparent hover:border-highlight-contributor transition-all duration-300">
                  <div className="flex w-full flex-col items-stretch justify-center gap-4 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full bg-highlight-contributor"></div>
                      <p className="text-sm font-semibold uppercase tracking-wider text-highlight-contributor">CONTRIBUTOR TIER</p>
                    </div>
                    <p className="text-forest-green text-4xl font-bold leading-tight tracking-[-0.015em]">8.2% <span className="text-2xl font-medium">APY</span></p>
                    <div className="flex flex-col gap-2 mt-2">
                      <p className="text-text-secondary text-base font-normal leading-normal">Total Staked: $850K</p>
                      <p className="text-text-secondary text-base font-normal leading-normal">Your Stake: $0</p>
                    </div>
                    <StakeButton tier="contributor" apy="8.2%" />
                  </div>
                </div>
                <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-white/50 border border-transparent hover:border-highlight-observer transition-all duration-300">               <div className="flex w-full flex-col items-stretch justify-center gap-4 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full bg-highlight-observer"></div>
                      <p className="text-sm font-semibold uppercase tracking-wider text-highlight-observer">OBSERVER TIER</p>
                    </div>
                    <p className="text-forest-green text-4xl font-bold leading-tight tracking-[-0.015em]">4.5% <span className="text-2xl font-medium">APY</span></p>
                    <div className="flex flex-col gap-2 mt-2">
                      <p className="text-text-secondary text-base font-normal leading-normal">Total Staked: $400K</p>
                      <p className="text-text-secondary text-base font-normal leading-normal">Your Stake: $0</p>
                    </div>
                    <StakeButton tier="observer" apy="4.5%" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="text-forest-green/30 opacity-50">
                  <span className="material-symbols-outlined text-6xl">potted_plant</span>
                </div>
                <h3 className="text-3xl font-bold text-forest-green">Active Proposals</h3>
              </div>
              <div className="flex flex-col gap-4">
                {activeProposals.map((proposal) => {
                  const totalVotes = proposal.votesFor + proposal.votesAgainst;
                  const forPercentage = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0;
                  const againstPercentage = 100 - forPercentage;
                  
                  return (
                    <div key={proposal.id} className="p-5 rounded-xl bg-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center rounded-full bg-forest-green/20 px-3 py-1 text-xs font-medium text-forest-green">Active</span>
                        <p className="text-sm text-text-secondary">{getTimeRemaining(proposal.endsAt)}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-forest-green">{proposal.title}</h4>
                        <p className="text-sm text-text-secondary mt-1">{proposal.description}</p>
                      </div>
                      <VoteButtons 
                        proposalId={proposal.id}
                        votesFor={proposal.votesFor}
                        votesAgainst={proposal.votesAgainst}
                      />
                    </div>
                  );
                })}
                
                {passedProposals.map((proposal) => {
                  const totalVotes = proposal.votesFor + proposal.votesAgainst;
                  const forPercentage = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0;
                  const againstPercentage = 100 - forPercentage;
                  
                  return (
                    <div key={proposal.id} className="p-5 rounded-xl bg-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col gap-4 opacity-60">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600">Closed</span>
                        <p className="text-sm text-text-secondary">{proposal.status === 'passed' ? 'Passed' : 'Rejected'}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-forest-green">{proposal.title}</h4>
                        <p className="text-sm text-text-secondary mt-1">{proposal.description}</p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div className="bg-green-600 transition-all duration-300" style={{width: `${forPercentage}%`}}></div>
                          <div className="bg-red-600 transition-all duration-300" style={{width: `${againstPercentage}%`}}></div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-600 font-semibold">{proposal.votesFor} For ({forPercentage}%)</span>
                          <span className="text-red-600 font-semibold">{proposal.votesAgainst} Against ({againstPercentage}%)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
  );
}
