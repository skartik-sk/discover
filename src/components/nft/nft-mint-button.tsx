'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Trophy,
  Zap,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Wallet,
  Loader2
} from 'lucide-react'
import { useAccount, useSigner } from 'wagmi'
import { useNFTMinting, generateTokenId, validateNFTClaim } from '@/lib/nft-contract'

interface NFTMintButtonProps {
  projectId: string
  projectName: string
  projectCategory: string
  hasTested: boolean
  hasReviewed: boolean
  className?: string
}

export function NFTMintButton({
  projectId,
  projectName,
  projectCategory,
  hasTested,
  hasReviewed,
  className
}: NFTMintButtonProps) {
  const { address, isConnected } = useAccount()
  const { data: signer } = useSigner()
  const { mintNFT, isMinting, error } = useNFTMinting()

  const [isEligible, setIsEligible] = useState(false)
  const [hasClaimed, setHasClaimed] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [mintResult, setMintResult] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (address && signer && hasTested && hasReviewed) {
      validateEligibility()
    }
  }, [address, signer, hasTested, hasReviewed])

  const validateEligibility = async () => {
    if (!address || !signer) return

    setIsValidating(true)
    try {
      const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
      if (!contractAddress) {
        console.error('NFT contract address not configured')
        return
      }

      const eligible = await validateNFTClaim(address, projectId, contractAddress, signer)
      setIsEligible(eligible)
      setHasClaimed(!eligible) // If not eligible, assume already claimed
    } catch (error) {
      console.error('Error validating eligibility:', error)
      setIsEligible(false)
    } finally {
      setIsValidating(false)
    }
  }

  const handleMintNFT = async () => {
    if (!address || !signer) {
      alert('Please connect your wallet first')
      return
    }

    if (!hasTested || !hasReviewed) {
      alert('You must test and review the project before claiming your NFT')
      return
    }

    try {
      const tokenId = generateTokenId(projectId, address)

      const result = await mintNFT(signer, {
        projectName,
        projectCategory,
        testerAddress: address,
        testedAt: new Date().toISOString().split('T')[0]
      }, tokenId)

      setMintResult(result)
      setHasClaimed(true)
      setIsEligible(false)
    } catch (error) {
      console.error('Error minting NFT:', error)
    }
  }

  const getNFTStatus = () => {
    if (!isConnected) return { status: 'connect', message: 'Connect wallet to claim NFT', color: 'gray' }
    if (!hasTested || !hasReviewed) return { status: 'ineligible', message: 'Test and review to claim NFT', color: 'yellow' }
    if (isValidating) return { status: 'validating', message: 'Checking eligibility...', color: 'blue' }
    if (hasClaimed) return { status: 'claimed', message: 'NFT already claimed', color: 'green' }
    if (isEligible) return { status: 'available', message: 'Claim your Early Tester NFT!', color: 'primary' }
    return { status: 'checking', message: 'Checking status...', color: 'gray' }
  }

  const nftStatus = getNFTStatus()

  const renderContent = () => {
    switch (nftStatus.status) {
      case 'connect':
        return (
          <Button variant="outline" className="w-full" disabled>
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        )

      case 'ineligible':
        return (
          <div className="space-y-3">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Complete both testing and review to unlock the Early Tester NFT reward.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={`flex items-center gap-2 ${hasTested ? 'text-green-600' : 'text-gray-400'}`}>
                {hasTested ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-gray-300" />}
                <span>Tested</span>
              </div>
              <div className={`flex items-center gap-2 ${hasReviewed ? 'text-green-600' : 'text-gray-400'}`}>
                {hasReviewed ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-gray-300" />}
                <span>Reviewed</span>
              </div>
            </div>
          </div>
        )

      case 'validating':
        return (
          <Button variant="outline" className="w-full" disabled>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Checking eligibility...
          </Button>
        )

      case 'available':
        return (
          <div className="space-y-3">
            <Button
              onClick={handleMintNFT}
              disabled={isMinting}
              className="w-full bg-gradient-primary text-white"
            >
              {isMinting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4 mr-2" />
                  Claim Early Tester NFT
                </>
              )}
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 'claimed':
        return (
          <div className="space-y-3">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                NFT successfully claimed! Check your wallet.
              </AlertDescription>
            </Alert>
            {mintResult && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(`https://etherscan.io/tx/${mintResult.transactionHash}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Transaction
              </Button>
            )}
          </div>
        )

      default:
        return (
          <Button variant="outline" className="w-full" disabled>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        )
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-lg">Early Tester Reward</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">NFT</Badge>
        </div>
        <CardDescription>
          Test and review this project to earn an exclusive Early Tester NFT
        </CardDescription>
      </CardHeader>

      <CardContent>
        {renderContent()}

        {/* NFT Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <h4 className="font-medium text-sm">NFT Details:</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Project: {projectName}</p>
              <p>• Category: {projectCategory}</p>
              <p>• Role: Early Tester</p>
              <p>• Utility: Proof of early adoption</p>
              <p>• Contract: {process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS?.slice(0, 6)}...{process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS?.slice(-4)}</p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-3"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </Button>
      </CardContent>
    </Card>
  )
}