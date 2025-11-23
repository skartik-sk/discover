import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding governance data...');

  // Get the first user
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.log('No user found. Please run the main seed first.');
    return;
  }

  // Create active proposals
  const proposal1 = await prisma.proposal.upsert({
    where: { id: 'proposal-1' },
    update: {},
    create: {
      id: 'proposal-1',
      title: 'Proposal #042: Adjust Platform Fees',
      description: 'Proposal to reduce transaction fees from 0.5% to 0.3% to encourage higher volume.',
      status: 'active',
      votesFor: 720,
      votesAgainst: 280,
      createdById: user.id,
      endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    },
  });

  const proposal2 = await prisma.proposal.upsert({
    where: { id: 'proposal-2' },
    update: {},
    create: {
      id: 'proposal-2',
      title: 'Proposal #041: New Contributor Tier Rewards',
      description: 'Introduce a bonus reward pool for the Contributor staking tier to incentivize participation.',
      status: 'active',
      votesFor: 450,
      votesAgainst: 550,
      createdById: user.id,
      endsAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    },
  });

  const proposal3 = await prisma.proposal.upsert({
    where: { id: 'proposal-3' },
    update: {},
    create: {
      id: 'proposal-3',
      title: 'Proposal #040: Marketing Budget Allocation',
      description: 'Allocate 5% of treasury funds towards a new marketing campaign for Q3.',
      status: 'passed',
      votesFor: 890,
      votesAgainst: 110,
      createdById: user.id,
      startsAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      endsAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  // Create sample stakes
  const stake1 = await prisma.stake.upsert({
    where: { id: 'stake-1' },
    update: {},
    create: {
      id: 'stake-1',
      amount: 5000,
      tier: 'validator',
      apy: 12.5,
      userId: user.id,
    },
  });

  console.log('Governance data seeding completed!');
  console.log({ proposal1, proposal2, proposal3, stake1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
