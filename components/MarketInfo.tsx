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
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-800 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-800 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950 border border-red-900 rounded-lg p-6">
        <p className="text-red-400">
          Error loading market data: {error.message}
        </p>
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
    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">{question}</h1>
        {isReported && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-900 text-green-300 text-sm font-medium">
            Market Resolved
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* YES outcome */}
        <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-950">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-100">
              {outcome1}
            </span>
            <span className="text-2xl font-bold text-blue-400">
              {yesProbability}%
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Reserve: {formatEther(yesTokenReserve)} tokens
          </div>
          {isReported && winningToken === yesToken && (
            <div className="mt-2 text-green-400 font-medium">
              ✓ Winning Outcome
            </div>
          )}
        </div>

        {/* NO outcome */}
        <div className="border-2 border-red-600 rounded-lg p-4 bg-red-950">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-100">
              {outcome2}
            </span>
            <span className="text-2xl font-bold text-red-400">
              {noProbability}%
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Reserve: {formatEther(noTokenReserve)} tokens
          </div>
          {isReported && winningToken === noToken && (
            <div className="mt-2 text-green-400 font-medium">
              ✓ Winning Outcome
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-800 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-400">ETH Collateral</p>
          <p className="font-semibold text-gray-100">
            {formatEther(ethCollateral)} ETH
          </p>
        </div>
        <div>
          <p className="text-gray-400">Initial Token Value</p>
          <p className="font-semibold text-gray-100">
            {formatEther(initialTokenValue)} ETH
          </p>
        </div>
        <div>
          <p className="text-gray-400">Trading Revenue</p>
          <p className="font-semibold text-gray-100">
            {formatEther(lpTradingRevenue)} ETH
          </p>
        </div>
        <div>
          <p className="text-gray-400">Locked %</p>
          <p className="font-semibold text-gray-100">
            {percentageLocked.toString()}%
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-4 mt-4 text-xs text-gray-500">
        <p>Oracle: {oracle}</p>
        <p>YES Token: {yesToken}</p>
        <p>NO Token: {noToken}</p>
      </div>
    </div>
  );
}
