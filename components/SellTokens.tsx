"use client";

import { useState } from "react";
import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { PREDICTION_MARKET_CONFIG, Outcome } from "@/lib/contract-config";
import { parseEther, formatEther } from "viem";

export function SellTokens() {
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome>(Outcome.YES);
  const [amount, setAmount] = useState("");

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // Get the price for selling tokens
  const { data: priceInEth } = useReadContract({
    ...PREDICTION_MARKET_CONFIG,
    functionName: "getSellPriceInEth",
    args:
      amount && !isNaN(parseFloat(amount))
        ? [selectedOutcome, parseEther(amount)]
        : undefined,
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSell = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      return;
    }

    try {
      writeContract({
        ...PREDICTION_MARKET_CONFIG,
        functionName: "sellTokensForEth",
        args: [selectedOutcome, parseEther(amount)],
      });
    } catch (err) {
      console.error("Error selling tokens:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Sell Tokens</h2>

      <div className="space-y-4">
        {/* Outcome Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Outcome
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedOutcome(Outcome.YES)}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                selectedOutcome === Outcome.YES
                  ? "bg-blue-500 text-white ring-2 ring-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              YES
            </button>
            <button
              onClick={() => setSelectedOutcome(Outcome.NO)}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                selectedOutcome === Outcome.NO
                  ? "bg-red-500 text-white ring-2 ring-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              NO
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount of Tokens to Sell
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.01"
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Price Display */}
        {priceInEth && amount && !isNaN(parseFloat(amount)) && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">You will receive:</span>
              <span className="text-xl font-bold text-gray-900">
                {formatEther(priceInEth)} ETH
              </span>
            </div>
          </div>
        )}

        {/* Sell Button */}
        <button
          onClick={handleSell}
          disabled={!amount || isPending || isConfirming || !priceInEth}
          className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isPending || isConfirming ? "Processing..." : "Sell Tokens"}
        </button>

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
            <p className="text-green-800">
              Transaction confirmed! Tokens sold successfully.
            </p>
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
