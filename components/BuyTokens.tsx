"use client";

import { useState } from "react";
import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { PREDICTION_MARKET_CONFIG, Outcome } from "@/lib/contract-config";
import { parseEther, formatEther } from "viem";

export function BuyTokens() {
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome>(Outcome.YES);
  const [amount, setAmount] = useState("");

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // Get the price for buying tokens
  const { data: priceInEth } = useReadContract({
    ...PREDICTION_MARKET_CONFIG,
    functionName: "getBuyPriceInEth",
    args:
      amount && !isNaN(parseFloat(amount))
        ? [selectedOutcome, parseEther(amount)]
        : undefined,
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleBuy = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      return;
    }

    try {
      writeContract({
        ...PREDICTION_MARKET_CONFIG,
        functionName: "buyTokensWithETH",
        args: [selectedOutcome, parseEther(amount)],
        value: priceInEth || BigInt(0),
      });
    } catch (err) {
      console.error("Error buying tokens:", err);
    }
  };

  return (
    <div className="bg-[#161B22] border border-[#2D333B] rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-[#2D333B]">
        <h2 className="text-lg font-semibold text-[#F9FAFB]">Buy Tokens</h2>
      </div>

      <div className="p-6 space-y-5">
        {/* Outcome Selection */}
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-3">
            Select Outcome
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedOutcome(Outcome.YES)}
              className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                selectedOutcome === Outcome.YES
                  ? "bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20"
                  : "bg-[#0D1117] text-[#9CA3AF] border border-[#2D333B] hover:border-[#3D444D]"
              }`}
            >
              YES
            </button>
            <button
              onClick={() => setSelectedOutcome(Outcome.NO)}
              className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                selectedOutcome === Outcome.NO
                  ? "bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/20"
                  : "bg-[#0D1117] text-[#9CA3AF] border border-[#2D333B] hover:border-[#3D444D]"
              }`}
            >
              NO
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-3">
            Amount of Tokens
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-[#0D1117] border border-[#2D333B] text-[#F9FAFB] rounded-xl focus:outline-none focus:border-[#3B82F6] transition-colors placeholder-[#6B7280] font-mono text-lg"
            />
          </div>
        </div>

        {/* Price Display */}
        {priceInEth && amount && !isNaN(parseFloat(amount)) && (
          <div className="bg-[#0D1117] border border-[#2D333B] rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#9CA3AF]">Cost in ETH</span>
              <span className="text-lg font-semibold text-[#F9FAFB] font-mono">
                {formatEther(priceInEth)}
              </span>
            </div>
          </div>
        )}

        {/* Buy Button */}
        <button
          onClick={handleBuy}
          disabled={!amount || isPending || isConfirming || !priceInEth}
          className="w-full px-6 py-3.5 bg-[#3B82F6] text-white font-medium rounded-xl hover:bg-[#6366F1] disabled:bg-[#2D333B] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-all shadow-lg shadow-[#3B82F6]/20 disabled:shadow-none"
        >
          {isPending || isConfirming ? "Processing..." : "Buy Tokens"}
        </button>

        {/* Status Messages */}
        {hash && (
          <div className="p-3 bg-[#0D1117] border border-[#2D333B] rounded-lg">
            <p className="text-xs text-[#9CA3AF] mb-1">Transaction Hash</p>
            <p className="font-mono text-xs text-[#6B7280] break-all">{hash}</p>
          </div>
        )}

        {isConfirming && (
          <div className="flex items-center gap-3 p-4 bg-[#0D1117] border border-[#2D333B] rounded-xl">
            <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-[#9CA3AF]">
              Waiting for confirmation...
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="flex items-center gap-3 p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl">
            <svg
              className="w-5 h-5 text-[#10B981]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-[#10B981]">
              Transaction confirmed successfully
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
            <p className="text-sm text-[#EF4444]">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
