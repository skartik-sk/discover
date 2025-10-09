import { ethers } from 'ethers'
import { useState } from 'react'

// NFT Contract ABI (simplified for demonstration)
const NFT_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
]

export class NFTContract {
  private contract: ethers.Contract
  private signer: ethers.JsonRpcSigner

  constructor(contractAddress: string, signer: ethers.JsonRpcSigner) {
    this.contract = new ethers.Contract(contractAddress, NFT_CONTRACT_ABI, signer)
    this.signer = signer
  }

  /**
   * Mint an NFT to the specified address
   */
  async mintNFT(toAddress: string, tokenId: number): Promise<ethers.ContractTransactionResponse> {
    try {
      const tx = await this.contract.mint(toAddress, tokenId)
      return tx
    } catch (error) {
      console.error('Error minting NFT:', error)
      throw new Error('Failed to mint NFT')
    }
  }

  /**
   * Get the token URI for a specific token ID
   */
  async getTokenURI(tokenId: number): Promise<string> {
    try {
      const uri = await this.contract.tokenURI(tokenId)
      return uri
    } catch (error) {
      console.error('Error getting token URI:', error)
      throw new Error('Failed to get token URI')
    }
  }

  /**
   * Get the NFT balance for an address
   */
  async getBalance(address: string): Promise<number> {
    try {
      const balance = await this.contract.balanceOf(address)
      return Number(balance)
    } catch (error) {
      console.error('Error getting balance:', error)
      throw new Error('Failed to get balance')
    }
  }

  /**
   * Wait for a transaction to be confirmed
   */
  async waitForTransaction(txHash: string): Promise<ethers.ContractTransactionReceipt> {
    try {
      const receipt = await this.signer.provider.waitForTransaction(txHash, 1)
      return receipt
    } catch (error) {
      console.error('Error waiting for transaction:', error)
      throw new Error('Transaction failed')
    }
  }
}

// NFT Metadata Service
export class NFTMetadataService {
  private baseURI: string

  constructor(baseURI: string) {
    this.baseURI = baseURI
  }

  /**
   * Generate NFT metadata for a project tester
   */
  generateMetadata(projectData: {
    projectName: string
    projectCategory: string
    testerAddress: string
    testedAt: string
    tokenId: number
  }) {
    const metadata = {
      name: `Early Tester - ${projectData.projectName}`,
      description: `NFT awarded to early testers of ${projectData.projectName}, a ${projectData.category.toLowerCase()} project on Web3 Project Hunt.`,
      image: `${this.baseURI}/images/${projectData.tokenId}.png`,
      attributes: [
        {
          trait_type: 'Project',
          value: projectData.projectName
        },
        {
          trait_type: 'Category',
          value: projectData.projectCategory
        },
        {
          trait_type: 'Role',
          value: 'Early Tester'
        },
        {
          trait_type: 'Tested At',
          value: projectData.testedAt
        },
        {
          trait_type: 'Token ID',
          value: projectData.tokenId
        }
      ],
      external_url: 'https://web3projecthunt.com',
      collection: {
        name: 'Web3 Project Hunt Testers',
        description: 'NFT collection for early testers of innovative Web3 projects'
      }
    }

    return metadata
  }

  /**
   * Upload metadata to IPFS (mock implementation)
   */
  async uploadMetadata(metadata: any): Promise<string> {
    // In a real implementation, this would upload to IPFS
    // For now, return a mock IPFS hash
    console.log('Uploading metadata:', metadata)
    return `ipfs://QmMock${Math.random().toString(36).substring(7)}`
  }
}

// NFT Minting Service
export class NFTMintingService {
  private nftContract: NFTContract
  private metadataService: NFTMetadataService
  private contractAddress: string

  constructor(contractAddress: string, signer: ethers.JsonRpcSigner) {
    this.nftContract = new NFTContract(contractAddress, signer)
    this.metadataService = new NFTMetadataService('https://api.web3projecthunt.com/metadata')
    this.contractAddress = contractAddress
  }

  /**
   * Mint NFT for early tester
   */
  async mintForEarlyTester(
    projectData: {
      projectName: string
      projectCategory: string
      testerAddress: string
      testedAt: string
    },
    tokenId: number
  ): Promise<{
    transactionHash: string
    tokenURI: string
    metadataCID: string
  }> {
    try {
      // Generate metadata
      const metadata = this.metadataService.generateMetadata({
        ...projectData,
        tokenId
      })

      // Upload metadata to IPFS
      const metadataCID = await this.metadataService.uploadMetadata(metadata)

      // Update token URI (this would typically be done by the contract)
      const tokenURI = `https://ipfs.io/ipfs/${metadataCID}`

      // Mint the NFT
      const tx = await this.nftContract.mintNFT(projectData.testerAddress, tokenId)

      // Wait for confirmation
      const receipt = await this.nftContract.waitForTransaction(tx.hash)

      return {
        transactionHash: receipt.hash,
        tokenURI,
        metadataCID
      }
    } catch (error) {
      console.error('Error minting NFT for early tester:', error)
      throw error
    }
  }

  /**
   * Check if user is eligible for NFT reward
   */
  async checkEligibility(
    userAddress: string,
    projectId: string
  ): Promise<boolean> {
    // In a real implementation, this would check:
    // 1. If user has tested the project
    // 2. If user hasn't already received NFT for this project
    // 3. If user meets the testing criteria

    // Mock implementation
    console.log(`Checking eligibility for ${userAddress} on project ${projectId}`)
    return true
  }

  /**
   * Get user's NFT balance
   */
  async getUserBalance(userAddress: string): Promise<number> {
    try {
      return await this.nftContract.getBalance(userAddress)
    } catch (error) {
      console.error('Error getting user balance:', error)
      return 0
    }
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return this.contractAddress
  }
}

// Hook for using NFT minting service
export function useNFTMinting() {
  const [isMinting, setIsMinting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mintNFT = async (
    signer: ethers.JsonRpcSigner,
    projectData: {
      projectName: string
      projectCategory: string
      testerAddress: string
      testedAt: string
    },
    tokenId: number
  ) => {
    setIsMinting(true)
    setError(null)

    try {
      const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
      if (!contractAddress) {
        throw new Error('NFT contract address not configured')
      }

      const mintingService = new NFTMintingService(contractAddress, signer)
      const result = await mintingService.mintForEarlyTester(projectData, tokenId)

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mint NFT'
      setError(errorMessage)
      throw err
    } finally {
      setIsMinting(false)
    }
  }

  return {
    mintNFT,
    isMinting,
    error
  }
}

// Utility functions
export const generateTokenId = (projectId: string, userId: string): number => {
  // Generate a deterministic token ID based on project and user
  const combined = `${projectId}-${userId}`
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash) % 1000000 // Keep it reasonable
}

export const validateNFTClaim = async (
  userAddress: string,
  projectId: string,
  contractAddress: string,
  signer: ethers.JsonRpcSigner
): Promise<boolean> => {
  try {
    const mintingService = new NFTMintingService(contractAddress, signer)
    return await mintingService.checkEligibility(userAddress, projectId)
  } catch (error) {
    console.error('Error validating NFT claim:', error)
    return false
  }
}