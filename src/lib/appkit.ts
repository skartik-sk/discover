import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { mainnet, polygon, arbitrum, base, optimism, avalanche, solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'
import { PhantomWalletAdapter, SolflareWalletAdapter, TrustWalletAdapter } from '@solana/wallet-adapter-wallets'

// Project ID from AppKit
export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '2b47d373840058d795b3a338738d0fe4'

// Metadata
const metadata = {
  name: 'Discover - Web3 Showcase',
  description: 'Discover and explore innovative Web3 projects',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://discover-web3.com',
  icons: ['https://discover-web3.com/icon.png']
}

// Define EVM networks
export const evmNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, polygon, arbitrum, base, optimism, avalanche]

// Define Solana networks
export const solanaNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [solana, solanaTestnet, solanaDevnet]

// All networks combined
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [...evmNetworks, ...solanaNetworks]

// Create Wagmi Adapter for EVM chains
export const wagmiAdapter = new WagmiAdapter({
  networks: evmNetworks,
  projectId,
})

// Create Solana Adapter with wallet support
export const solanaAdapter = new SolanaAdapter({
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TrustWalletAdapter()
  ]
})

// Create QueryClient for React Query
export const queryClient = new QueryClient()

// Create AppKit with both EVM and Solana adapters
export const modal = createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#CCFF00', // Lime primary color
    '--w3m-color-mix': '#0a0a0a',
    '--w3m-color-mix-strength': 40,
  }
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
