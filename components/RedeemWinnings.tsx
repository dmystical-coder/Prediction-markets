"use client";

import { useState } from "react";
import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { PREDICTION_MARKET_CONFIG } from "@/lib/contract-config";
import { parseEther } from "viem";

export function RedeemWinnings() {
  const [amount, setAmount] = useState("");

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Check if market is reported
  const { data: marketData } = useReadContract({
    ...PREDICTION_MARKET_CONFIG,
    functionName: "getPrediction",
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
        functionName: "redeemWinningTokens",
        args: [parseEther(amount)],
      });
    } catch (err) {
      console.error("Error redeeming tokens:", err);
    }
  };

  const handleResolve = async () => {
    try {
      writeContract({
        ...PREDICTION_MARKET_CONFIG,
        functionName: "resolveMarketAndWithdraw",
      });
    } catch (err) {
      console.error("Error resolving market:", err);
    }
  };

  if (!isReported) {
    return (
      <div className="bg-yellow-950 border border-yellow-900 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-yellow-300 mb-2">
          Market Not Yet Resolved
        </h2>
        <p className="text-yellow-400">
          This market has not been reported by the oracle yet. Once the outcome
          is reported, you will be able to redeem your winning tokens here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">
        Redeem Winning Tokens
      </h2>

      {winningToken && (
        <div className="bg-green-950 border border-green-900 rounded-lg p-4 mb-4">
          <p className="text-green-300 font-medium mb-1">Market Resolved!</p>
          <p className="text-sm text-green-400">
            Winning Token:{" "}
            <span className="font-mono text-xs">{winningToken}</span>
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount of Winning Tokens to Redeem
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.01"
            min="0"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500"
          />
          <p className="mt-1 text-sm text-gray-400">
            Enter the amount of winning tokens you want to redeem for ETH
          </p>
        </div>

        {/* Redeem Button */}
        <button
          onClick={handleRedeem}
          disabled={!amount || isPending || isConfirming}
          className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {isPending || isConfirming ? "Processing..." : "Redeem Tokens"}
        </button>

        <div className="border-t border-gray-800 pt-4">
          <p className="text-sm font-medium text-gray-300 mb-2">
            Market Owner Actions
          </p>
          <button
            onClick={handleResolve}
            disabled={isPending || isConfirming}
            className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isPending || isConfirming
              ? "Processing..."
              : "Resolve Market & Withdraw"}
          </button>
          <p className="mt-1 text-xs text-gray-500">
            Only the market owner can resolve the market and withdraw remaining
            funds
          </p>
        </div>

        {/* Status Messages */}
        {hash && (
          <div className="text-sm">
            <p className="text-gray-400">Transaction Hash:</p>
            <p className="font-mono text-xs break-all text-blue-400">{hash}</p>
          </div>
        )}

        {isConfirming && (
          <div className="bg-yellow-950 border border-yellow-900 rounded-lg p-4">
            <p className="text-yellow-400">Waiting for confirmation...</p>
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-950 border border-green-900 rounded-lg p-4">
            <p className="text-green-400">
              Transaction confirmed successfully!
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-950 border border-red-900 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
