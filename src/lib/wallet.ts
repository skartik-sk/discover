import { createClient } from 'viem'
import { useAccount, useSignMessage, useSwitchChain } from 'wagmi'
import { mainnet } from 'viem/chains'
import { supabase } from './supabase'

export function useWalletAuth() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { switchChain } = useSwitchChain()

  const linkWallet = async (userId: string) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    try {
      // Create message to sign
      const message = `Link this wallet to your Web3 Project Hunt account: ${address}`

      // Sign message
      const signature = await signMessageAsync({ message })

      // Update user's wallet address in database
      const { error } = await supabase
        .from('users')
        .update({
          wallet_address: address,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        throw new Error('Failed to link wallet')
      }

      return true
    } catch (error) {
      console.error('Error linking wallet:', error)
      throw error
    }
  }

  const verifyWalletOwnership = async (message: string, signature: string) => {
    try {
      const recoveredAddress = await verifyMessage(message, signature)
      return recoveredAddress.toLowerCase() === address?.toLowerCase()
    } catch (error) {
      console.error('Error verifying wallet ownership:', error)
      return false
    }
  }

  return {
    address,
    isConnected,
    linkWallet,
    verifyWalletOwnership,
    switchChain
  }
}

// Helper function to verify message (you'll need to implement this with your preferred method)
async function verifyMessage(message: string, signature: string): Promise<string> {
  // This is a placeholder - implement proper message verification
  // You might want to use ethers.js or viem's verifyMessage function
  return ''
}