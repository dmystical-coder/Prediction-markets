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
      <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">
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
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{question}</h1>
        {isReported && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            Market Resolved
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* YES outcome */}
        <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">
              {outcome1}
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {yesProbability}%
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Reserve: {formatEther(yesTokenReserve)} tokens
          </div>
          {isReported && winningToken === yesToken && (
            <div className="mt-2 text-green-600 font-medium">
              ✓ Winning Outcome
            </div>
          )}
        </div>

        {/* NO outcome */}
        <div className="border-2 border-red-500 rounded-lg p-4 bg-red-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">
              {outcome2}
            </span>
            <span className="text-2xl font-bold text-red-600">
              {noProbability}%
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Reserve: {formatEther(noTokenReserve)} tokens
          </div>
          {isReported && winningToken === noToken && (
            <div className="mt-2 text-green-600 font-medium">
              ✓ Winning Outcome
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-600">ETH Collateral</p>
          <p className="font-semibold text-gray-900">
            {formatEther(ethCollateral)} ETH
          </p>
        </div>
        <div>
          <p className="text-gray-600">Initial Token Value</p>
          <p className="font-semibold text-gray-900">
            {formatEther(initialTokenValue)} ETH
          </p>
        </div>
        <div>
          <p className="text-gray-600">Trading Revenue</p>
          <p className="font-semibold text-gray-900">
            {formatEther(lpTradingRevenue)} ETH
          </p>
        </div>
        <div>
          <p className="text-gray-600">Locked %</p>
          <p className="font-semibold text-gray-900">
            {percentageLocked.toString()}%
          </p>
        </div>
      </div>

      <div className="border-t pt-4 mt-4 text-xs text-gray-500">
        <p>Oracle: {oracle}</p>
        <p>YES Token: {yesToken}</p>
        <p>NO Token: {noToken}</p>
      </div>
    </div>
  );
}
