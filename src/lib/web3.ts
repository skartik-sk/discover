'use client'

import { useState, useEffect } from 'react'

export interface WalletState {
  isConnected: boolean
  address: string | null
  chainId: number | null
  isConnecting: boolean
  error: string | null
}

export interface WalletInfo {
  name: string
  icon: string
  id: string
  isInstalled: boolean
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    isConnecting: false,
    error: null
  })

  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([])

  useEffect(() => {
    // Check for installed wallets
    const wallets: WalletInfo[] = []

    // Check for MetaMask
    if (typeof window !== 'undefined' && window.ethereum) {
      wallets.push({
        name: 'MetaMask',
        icon: '🦊',
        id: 'metamask',
        isInstalled: true
      })
    }

    // Check for Coinbase Wallet
    if (typeof window !== 'undefined' && (window as any).coinbaseWalletExtension) {
      wallets.push({
        name: 'Coinbase Wallet',
        icon: '🔵',
        id: 'coinbase',
        isInstalled: true
      })
    }

    // Check for WalletConnect
    wallets.push({
      name: 'WalletConnect',
      icon: '🔗',
      id: 'walletconnect',
      isInstalled: true // WalletConnect is always available via mobile
    })

    setAvailableWallets(wallets)
  }, [])

  const connectWallet = async (walletId: string): Promise<boolean> => {
    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }))

    try {
      if (walletId === 'metamask' && window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })

        if (accounts.length > 0) {
          const account = accounts[0]
          const chainId = await window.ethereum.request({
            method: 'eth_chainId'
          })

          setWalletState({
            isConnected: true,
            address: account,
            chainId: parseInt(chainId, 16),
            isConnecting: false,
            error: null
          })

          // Listen for account changes
          window.ethereum.on('accountsChanged', handleAccountsChanged)
          window.ethereum.on('chainChanged', handleChainChanged)

          return true
        }
      } else if (walletId === 'coinbase') {
        // Coinbase Wallet connection logic
        if ((window as any).coinbaseWalletExtension) {
          const accounts = await (window as any).coinbaseWalletExtension.request({
            method: 'eth_requestAccounts'
          })

          if (accounts.length > 0) {
            setWalletState({
              isConnected: true,
              address: accounts[0],
              chainId: 1, // Default to Ethereum mainnet
              isConnecting: false,
              error: null
            })
            return true
          }
        }
      } else if (walletId === 'walletconnect') {
        // WalletConnect connection logic (simplified for demo)
        // In a real app, you'd integrate with WalletConnect v2
        setWalletState({
          isConnected: true,
          address: '0x1234567890123456789012345678901234567890', // Mock address
          chainId: 1,
          isConnecting: false,
          error: null
        })
        return true
      }

      throw new Error('Wallet connection failed')
    } catch (error: any) {
      setWalletState({
        isConnected: false,
        address: null,
        chainId: null,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet'
      })
      return false
    }
  }

  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      address: null,
      chainId: null,
      isConnecting: false,
      error: null
    })

    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setWalletState(prev => ({
        ...prev,
        address: accounts[0]
      }))
    }
  }

  const handleChainChanged = (chainId: string) => {
    setWalletState(prev => ({
      ...prev,
      chainId: parseInt(chainId, 16)
    }))
  }

  const getChainName = (chainId: number): string => {
    const chains: { [key: number]: string } = {
      1: 'Ethereum',
      3: 'Ropsten',
      4: 'Rinkeby',
      5: 'Goerli',
      42: 'Kovan',
      137: 'Polygon',
      80001: 'Mumbai',
      56: 'BSC',
      97: 'BSC Testnet',
      42161: 'Arbitrum One',
      421611: 'Arbitrum Rinkeby',
      10: 'Optimism',
      69: 'Optimism Kovan'
    }
    return chains[chainId] || `Chain ${chainId}`
  }

  const shortenAddress = (address: string): string => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return {
    walletState,
    availableWallets,
    connectWallet,
    disconnectWallet,
    getChainName,
    shortenAddress
  }
}