'use client';

import { useState } from 'react';

interface StakeButtonProps {
  tier: 'validator' | 'contributor' | 'observer';
  apy: string;
}

export default function StakeButton({ tier, apy }: StakeButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    
    try {
      // In production, this would connect to wallet and execute staking contract
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Staking ${amount} tokens in ${tier} tier (${apy} APY)\n\nNote: This is a demo. In production, this would connect to your Web3 wallet.`);
      setShowModal(false);
      setAmount('');
    } catch (error) {
      alert('Staking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="mt-4 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-forest-green text-soft-cream text-sm font-medium leading-normal hover:opacity-90 transition-opacity"
      >
        <span className="truncate">Stake Now</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-forest-green capitalize">{tier} Tier Staking</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-forest-green/5 rounded-lg">
              <p className="text-sm text-text-secondary mb-1">Annual Percentage Yield</p>
              <p className="text-2xl font-bold text-forest-green">{apy}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-body-text mb-2">
                Amount to Stake
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
              />
            </div>

            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> This is a demo feature. In production, this would connect to your Web3 wallet (MetaMask, WalletConnect, etc.) and execute a smart contract transaction.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-body-text hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStake}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-forest-green text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Stake'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
