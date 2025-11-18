"use client";

import { useReadContract } from "wagmi";
import { PREDICTION_MARKET_CONFIG } from "@/lib/contract-config";
import { formatEther } from "viem";

export function MarketInfo() {
  const {
    data: marketData,
    isLoading,
    error,
  } = useReadContract({
    ...PREDICTION_MARKET_CONFIG,
    functionName: "getPrediction",
  });

  if (isLoading) {
    return (
      <div className="bg-[#161B22] border border-[#2D333B] rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-[#2D333B] rounded w-3/4 mb-6"></div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-24 bg-[#2D333B] rounded-xl"></div>
          <div className="h-24 bg-[#2D333B] rounded-xl"></div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="h-16 bg-[#2D333B] rounded-lg"></div>
          <div className="h-16 bg-[#2D333B] rounded-lg"></div>
          <div className="h-16 bg-[#2D333B] rounded-lg"></div>
          <div className="h-16 bg-[#2D333B] rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#161B22] border border-[#EF4444] rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#EF4444]/10 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#EF4444]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-[#F9FAFB] mb-1">
              Error loading market data
            </p>
            <p className="text-xs text-[#9CA3AF]">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!marketData) {
    return null;
  }

  const [
    question,
    outcome1,
    outcome2,
    oracle,
    initialTokenValue,
    yesTokenReserve,
    noTokenReserve,
    isReported,
    yesToken,
    noToken,
    winningToken,
    ethCollateral,
    lpTradingRevenue,
    predictionMarketOwner,
    initialProbability,
    percentageLocked,
  ] = marketData;

  // Calculate probabilities based on token reserves
  const totalReserves = Number(yesTokenReserve) + Number(noTokenReserve);
  const yesProbability =
    totalReserves > 0
      ? ((Number(noTokenReserve) / totalReserves) * 100).toFixed(2)
      : "50.00";
  const noProbability =
    totalReserves > 0
      ? ((Number(yesTokenReserve) / totalReserves) * 100).toFixed(2)
      : "50.00";

  return (
    <div className="bg-[#161B22] border border-[#2D333B] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#2D333B]">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-xl font-semibold text-[#F9FAFB] leading-tight">
            {question}
          </h2>
          {isReported && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
              <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
              <span className="text-xs font-medium text-[#10B981]">
                Resolved
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Outcomes Grid - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D333B]">
        {/* YES outcome */}
        <div className="bg-[#161B22] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#9CA3AF]">
              {outcome1}
            </span>
            {isReported && winningToken === yesToken && (
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
            )}
          </div>
          <div className="mb-3">
            <div className="text-4xl font-semibold text-[#F9FAFB] mb-1">
              {yesProbability}%
            </div>
            <div className="h-1.5 bg-[#0D1117] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                style={{ width: `${yesProbability}%` }}
              ></div>
            </div>
          </div>
          <div className="text-xs text-[#6B7280]">
            Reserve:{" "}
            <span className="font-mono text-[#9CA3AF]">
              {formatEther(yesTokenReserve)}
            </span>
          </div>
        </div>

        {/* NO outcome */}
        <div className="bg-[#161B22] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#9CA3AF]">
              {outcome2}
            </span>
            {isReported && winningToken === noToken && (
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
            )}
          </div>
          <div className="mb-3">
            <div className="text-4xl font-semibold text-[#F9FAFB] mb-1">
              {noProbability}%
            </div>
            <div className="h-1.5 bg-[#0D1117] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#EF4444] rounded-full transition-all duration-500"
                style={{ width: `${noProbability}%` }}
              ></div>
            </div>
          </div>
          <div className="text-xs text-[#6B7280]">
            Reserve:{" "}
            <span className="font-mono text-[#9CA3AF]">
              {formatEther(noTokenReserve)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#2D333B] border-t border-[#2D333B]">
        <div className="bg-[#161B22] p-4">
          <p className="text-xs text-[#6B7280] mb-1">ETH Collateral</p>
          <p className="text-sm font-semibold text-[#F9FAFB] font-mono">
            {formatEther(ethCollateral)}
          </p>
        </div>
        <div className="bg-[#161B22] p-4">
          <p className="text-xs text-[#6B7280] mb-1">Token Value</p>
          <p className="text-sm font-semibold text-[#F9FAFB] font-mono">
            {formatEther(initialTokenValue)}
          </p>
        </div>
        <div className="bg-[#161B22] p-4">
          <p className="text-xs text-[#6B7280] mb-1">Revenue</p>
          <p className="text-sm font-semibold text-[#F9FAFB] font-mono">
            {formatEther(lpTradingRevenue)}
          </p>
        </div>
        <div className="bg-[#161B22] p-4">
          <p className="text-xs text-[#6B7280] mb-1">Locked</p>
          <p className="text-sm font-semibold text-[#F9FAFB]">
            {percentageLocked.toString()}%
          </p>
        </div>
      </div>

      {/* Footer - Contract Details */}
      <details className="border-t border-[#2D333B]">
        <summary className="px-6 py-3 text-xs text-[#6B7280] cursor-pointer hover:text-[#9CA3AF] transition-colors">
          Contract Details
        </summary>
        <div className="px-6 pb-4 space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#6B7280] min-w-[80px]">Oracle</span>
            <span className="font-mono text-[#9CA3AF] truncate">{oracle}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#6B7280] min-w-[80px]">YES Token</span>
            <span className="font-mono text-[#9CA3AF] truncate">
              {yesToken}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#6B7280] min-w-[80px]">NO Token</span>
            <span className="font-mono text-[#9CA3AF] truncate">{noToken}</span>
          </div>
        </div>
      </details>
    </div>
  );
}
