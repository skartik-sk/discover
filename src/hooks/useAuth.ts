import { useAccount } from 'wagmi';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useEffect } from 'react';

export function useAuth() {
  // Get account info from AppKit (works for both EVM and Solana)
  const { address: appKitAddress, isConnected: appKitConnected, caipAddress } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();
  
  // Fallback to wagmi for EVM-specific functionality
  const { address: wagmiAddress, isConnected: wagmiConnected, isConnecting } = useAccount();
  
  // Determine chain type from CAIP network ID
  const chainType = typeof caipNetwork?.id === 'string' && caipNetwork.id.startsWith('solana') ? 'solana' : 'evm';
  const networkName = caipNetwork?.name || 'Unknown Network';
  
  // Use AppKit address if available, otherwise fall back to wagmi
  const address = appKitAddress || wagmiAddress;
  const isConnected = appKitConnected || wagmiConnected;
  
  const createOrUpdateUser = useMutation(api.users.createOrUpdate);

  // Create or update user when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      createOrUpdateUser({
        walletAddress: address,
      }).catch((error) => {
        console.error('Error creating/updating user:', error);
      });
    }
  }, [isConnected, address, createOrUpdateUser]);

  return {
    address,
    isConnected,
    isConnecting,
    walletAddress: address || null,
    chainType,
    networkName,
    caipAddress,
  };
}

// Hook to check if current user owns a resource
export function useIsOwner(ownerWallet?: string) {
  const { address } = useAuth();
  
  if (!address || !ownerWallet) {
    return false;
  }

  return address.toLowerCase() === ownerWallet.toLowerCase();
}
