import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@discover.com' },
    update: {},
    create: {
      email: 'demo@discover.com',
      name: 'Demo User',
      username: 'demouser',
      password: hashedPassword,
      bio: 'Web3 enthusiast and early adopter',
      trustScore: 850,
      twitter: '@demouser',
      github: 'demouser',
    },
  })

  console.log('Created user:', user)

  // Create sample projects
  const projects = [
    {
      name: 'Quantum Ledger',
      slug: 'quantum-ledger',
      tagline: 'Decentralized asset management powered by quantum computing',
      description: 'Quantum Ledger is a revolutionary decentralized finance (DeFi) protocol that leverages cutting-edge quantum computing technology to offer users a secure, transparent, and highly efficient platform for trading and managing digital assets.',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOyflq0lOLqIHIj6DrKczMsyuyYIUM0Uk0XQY-RhLq83I2_wvndiUuwt6lV2KU2ZnT2RW1y9l7onf_HQ-GclqbPDp2oZ21YDK9aOcOzsBcqK-xLYgYCnSwq5iald_r55NHTu0sRYj-SQnWB0lEIPG-aGCJORcReK2XuVO47pBF3p0BLhce3AnT9pcR8V_PckCcpfIrQs73svF5r8oRs4pv_aKetgxjE7kFzcleSvsDZTXugeN7DZAJD9q9N0dD7l7mX8jrTgzcZZJy',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9AawDW9tRN8nZQsBrSCvl7N9G5hCL4fSKh-hRq3LTu6b303qbPo5gT3H3ibq6nPbtSun0chmZxpvjfe6wRI6d8HcHaoN6vzDcgyCfDOOIrVvUTohLNKXKM4Kt_4nSoFNjXfS-iezhayD5YLMTa7NYUOqiRLXNb3fXpQcYKQVjEd_u3oUo0bVKQzoQQXKGgrxtMYo08AwOPjL2O34sCz_ptwFvfUjuDSHtab3QMlOhQLiN-i8aS1E2Vu3engcQQlUVH5_qV2YxqL2J',
      videoUrl: 'https://youtube.com/watch?v=demo',
      websiteUrl: 'https://quantumledger.io',
      category: 'DeFi',
      tags: 'AI,Quantum Computing,Asset Management',
      blockchains: 'Ethereum,Polygon',
      twitter: '@quantumledger',
      discord: 'discord.gg/quantumledger',
      github: 'quantumledger/protocol',
      upvotes: 1245,
      viewCount: 5420,
      status: 'approved',
      featured: true,
      userId: user.id,
    },
    {
      name: 'Artifex Prime',
      slug: 'artifex-prime',
      tagline: 'A generative art platform for creating and trading unique NFTs',
      description: 'Artifex Prime is a cutting-edge generative art platform that empowers artists and creators to mint, showcase, and trade unique NFT artwork using AI-powered tools.',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn3UWp_fd3KajrkhM-jyWaQbCZZPPnB1Qk7RbFCtAtQAQe48BhsYqKrF7GR3HO81Esk-KvujjuZMYBBf2BWIrMk8dBWYYTbnBYZ2l8PKgdP6VmAwk9aqneajzfdMIOAWOo0mXT0h7Shf97ijtLdpaYEQBGnr9On9T7puB_LPINq19vzIbO0ymmk2Np9nbpP5b9M-YdMoA-eKqhgaokXdgLjf8Zvehkw-gmpCmU5vUrN8zP--xNRWr2qQ2EpHtUAYJQyYnQV4Lp47hm',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKG7qUGGFBD-uG1YeMOKZEhSJZoy9CVoXM3g8DLDHWr4PVDapr-erblPKI0mJFxPv6gEUPmAZALlSXSMAQGfPgV2EbY78pb3HE_ReNa7AsmOaLkzydBbWixhgZaNt_-6w7oKLtgJRktZE5ppQNvbYbZ3wQBcQ_EOvH9bxZDF91nnX1nEnWDgL9pSPRt19_u1wNw3_mixSC4_fNizC5jdLBTCen-r42qTHmNJqYvZ29Z7wXmmQMppGWWsOD-9A0VwjrQbUwvEn9Xcjk',
      websiteUrl: 'https://artifexprime.art',
      category: 'NFT',
      tags: 'Art,Generative,AI',
      blockchains: 'Ethereum,Polygon',
      twitter: '@artifexprime',
      upvotes: 987,
      viewCount: 3250,
      status: 'approved',
      userId: user.id,
    },
    {
      name: 'DAOhaus v3',
      slug: 'daohaus-v3',
      tagline: 'The next generation of community-owned and operated DAOs',
      description: 'DAOhaus v3 is a comprehensive platform for creating, managing, and participating in decentralized autonomous organizations with advanced governance features.',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa1Q5ZoqBsLBXWaYnaV0Bs4sO7YJpMfRcC7i-JAkYGXYUoWsul8w6JelZdJcXX7VfvKsHmp-MeCu95BROodXGqYUY4yH4Ki_MUovpRu70PHMWlj0KK3iM0nwOXVq1V16CbBblyUpIb38ZiOrfIlLANoShydL5Y3uJcSq8_HKsZoyDAWCewO3cRMYuN5A05y1uRRQcaJhhgQO0scCr3uyHeaU_L4T47hcetGZ2qoSmGwrZB0pjDwGV_HwApoPj0vGmP86eY1AOmn5vD',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzLtPhmNYW6AWzDHq6KyJmrlZT7k9mTzb269hItNj2-Dc4dFciw-88byjU8-YDzIkksG78riCAl6yPDR5MlPpYUHYJ3v8nTCsFeevijtjmUO8hUxooL4SOHhzspuGMmj2dNZbWb8JlHd6SGevBq1bNKdUap57Smjlph6Pv9wiIiy_3c5gmK09k4_ZgaklY959bKNqIbGVb8u3UT0b6Y6DFdvFoChb4ByNhG6VSv0GReM7CsoiWdVyJxfQc7hrJFhji4Uz9uOM0Fiyq',
      websiteUrl: 'https://daohaus.club',
      category: 'DAO',
      tags: 'Governance,Community,Tools',
      blockchains: 'Ethereum,Gnosis Chain',
      twitter: '@daohaus',
      discord: 'discord.gg/daohaus',
      github: 'daohaus/daohaus-v3',
      upvotes: 852,
      viewCount: 2890,
      status: 'approved',
      userId: user.id,
    },
  ]

  for (const projectData of projects) {
    const project = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: {},
      create: projectData,
    })
    console.log('Created project:', project.name)
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
