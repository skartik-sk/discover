import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'viem'
import { mainnet, polygon, arbitrum, optimism, base } from 'viem/chains'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default-project-id'

export const config = getDefaultConfig({
  appName: 'Discover',
  projectId: projectId,
  chains: [mainnet, polygon, arbitrum, optimism, base],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
})