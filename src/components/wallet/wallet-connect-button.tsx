'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'

export function WalletConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {connected ? (
              <div className="flex gap-2">
                <Button
                  onClick={openChainModal}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {chain.hasIcon && (
                    <div
                      style={{
                        background: chain.iconBackground,
                        width: 16,
                        height: 16,
                        borderRadius: 999,
                        overflow: 'hidden',
                        marginRight: 4,
                      }}
                    >
                      {chain.iconUrl && (
                        <img
                          alt={chain.name ?? 'Chain icon'}
                          src={chain.iconUrl}
                          style={{ width: 16, height: 16 }}
                        />
                      )}
                    </div>
                  )}
                  {chain.name}
                </Button>
                <Button
                  onClick={openAccountModal}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  {account.displayName}
                  {account.displayBalance
                    ? ` (${account.displayBalance})`
                    : ''}
                </Button>
              </div>
            ) : (
              <Button
                onClick={openConnectModal}
                className="bg-gradient-primary text-white"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}