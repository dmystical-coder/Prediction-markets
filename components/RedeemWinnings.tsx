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
      <div className="bg-[#161B22] border border-[#2D333B] rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-[#3B82F6]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#F9FAFB] mb-1">
              Market Not Yet Resolved
            </h2>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              This market has not been reported by the oracle yet. Once the
              outcome is reported, you will be able to redeem your winning
              tokens here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#161B22] border border-[#2D333B] rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-[#2D333B]">
        <h2 className="text-lg font-semibold text-[#F9FAFB]">
          Redeem Winning Tokens
        </h2>
      </div>

      <div className="p-6 space-y-5">
        {winningToken && (
          <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
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
              <p className="text-sm font-medium text-[#10B981]">
                Market Resolved
              </p>
            </div>
            <p className="text-xs text-[#10B981]/80">
              Winning Token: <span className="font-mono">{winningToken}</span>
            </p>
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-3">
            Amount of Winning Tokens to Redeem
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.01"
            min="0"
            className="w-full px-4 py-3 bg-[#0D1117] border border-[#2D333B] text-[#F9FAFB] rounded-xl focus:outline-none focus:border-[#3B82F6] transition-colors placeholder-[#6B7280] font-mono text-lg"
          />
          <p className="mt-2 text-xs text-[#6B7280]">
            Enter the amount of winning tokens you want to redeem for ETH
          </p>
        </div>

        {/* Redeem Button */}
        <button
          onClick={handleRedeem}
          disabled={!amount || isPending || isConfirming}
          className="w-full px-6 py-3.5 bg-[#10B981] text-white font-medium rounded-xl hover:bg-[#10B981]/90 disabled:bg-[#2D333B] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-all shadow-lg shadow-[#10B981]/20 disabled:shadow-none"
        >
          {isPending || isConfirming ? "Processing..." : "Redeem Tokens"}
        </button>

        {/* Market Owner Actions */}
        <div className="pt-5 border-t border-[#2D333B]">
          <p className="text-xs font-medium text-[#9CA3AF] mb-3">
            Market Owner Actions
          </p>
          <button
            onClick={handleResolve}
            disabled={isPending || isConfirming}
            className="w-full px-6 py-3.5 bg-[#6366F1] text-white font-medium rounded-xl hover:bg-[#6366F1]/90 disabled:bg-[#2D333B] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-all"
          >
            {isPending || isConfirming
              ? "Processing..."
              : "Resolve Market & Withdraw"}
          </button>
          <p className="mt-2 text-xs text-[#6B7280]">
            Only the market owner can resolve the market and withdraw remaining
            funds
          </p>
        </div>

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
