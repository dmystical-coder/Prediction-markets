'use client';

import { useState } from 'react';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { PREDICTION_MARKET_CONFIG } from '@/lib/contract-config';
import { parseEther } from 'viem';

export function RedeemWinnings() {
  const [amount, setAmount] = useState('');
  
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Check if market is reported
  const { data: marketData } = useReadContract({
    ...PREDICTION_MARKET_CONFIG,
    functionName: 'getPrediction',
  });

  const isReported = marketData ? marketData[7] : false;
  const winningToken = marketData ? marketData[10] : null;

  const handleRedeem = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      return;
    }

    try {
      writeContract({
        ...PREDICTION_MARKET_CONFIG,
        functionName: 'redeemWinningTokens',
        args: [parseEther(amount)],
      });
    } catch (err) {
      console.error('Error redeeming tokens:', err);
    }
  };

  const handleResolve = async () => {
    try {
      writeContract({
        ...PREDICTION_MARKET_CONFIG,
        functionName: 'resolveMarketAndWithdraw',
      });
    } catch (err) {
      console.error('Error resolving market:', err);
    }
  };

  if (!isReported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-yellow-900 mb-2">Market Not Yet Resolved</h2>
        <p className="text-yellow-800">
          This market has not been reported by the oracle yet. Once the outcome is reported, 
          you will be able to redeem your winning tokens here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Redeem Winning Tokens</h2>

      {winningToken && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-medium mb-1">Market Resolved!</p>
          <p className="text-sm text-green-700">
            Winning Token: <span className="font-mono text-xs">{winningToken}</span>
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount of Winning Tokens to Redeem
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.01"
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter the amount of winning tokens you want to redeem for ETH
          </p>
        </div>

        {/* Redeem Button */}
        <button
          onClick={handleRedeem}
          disabled={!amount || isPending || isConfirming}
          className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isPending || isConfirming ? 'Processing...' : 'Redeem Tokens'}
        </button>

        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Market Owner Actions
          </p>
          <button
            onClick={handleResolve}
            disabled={isPending || isConfirming}
            className="w-full px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isPending || isConfirming ? 'Processing...' : 'Resolve Market & Withdraw'}
          </button>
          <p className="mt-1 text-xs text-gray-500">
            Only the market owner can resolve the market and withdraw remaining funds
          </p>
        </div>

        {/* Status Messages */}
        {hash && (
          <div className="text-sm">
            <p className="text-gray-600">Transaction Hash:</p>
            <p className="font-mono text-xs break-all text-blue-600">{hash}</p>
          </div>
        )}
        
        {isConfirming && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">Waiting for confirmation...</p>
          </div>
        )}
        
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">Transaction confirmed successfully!</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
