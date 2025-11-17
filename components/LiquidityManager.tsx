"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PREDICTION_MARKET_CONFIG } from "@/lib/contract-config";
import { parseEther } from "viem";

export function LiquidityManager() {
  const [addAmount, setAddAmount] = useState("");
  const [removeAmount, setRemoveAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"add" | "remove">("add");

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleAddLiquidity = async () => {
    if (!addAmount || isNaN(parseFloat(addAmount))) {
      return;
    }

    try {
      writeContract({
        ...PREDICTION_MARKET_CONFIG,
        functionName: "addLiquidity",
        value: parseEther(addAmount),
      });
    } catch (err) {
      console.error("Error adding liquidity:", err);
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!removeAmount || isNaN(parseFloat(removeAmount))) {
      return;
    }

    try {
      writeContract({
        ...PREDICTION_MARKET_CONFIG,
        functionName: "removeLiquidity",
        args: [parseEther(removeAmount)],
      });
    } catch (err) {
      console.error("Error removing liquidity:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Liquidity Management
      </h2>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 font-semibold transition-all ${
            activeTab === "add"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Add Liquidity
        </button>
        <button
          onClick={() => setActiveTab("remove")}
          className={`px-4 py-2 font-semibold transition-all ${
            activeTab === "remove"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Remove Liquidity
        </button>
      </div>

      {/* Add Liquidity Tab */}
      {activeTab === "add" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ETH Amount to Add
            </label>
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder="0.0"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleAddLiquidity}
            disabled={!addAmount || isPending || isConfirming}
            className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isPending || isConfirming ? "Processing..." : "Add Liquidity"}
          </button>
        </div>
      )}

      {/* Remove Liquidity Tab */}
      {activeTab === "remove" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ETH Amount to Withdraw
            </label>
            <input
              type="number"
              value={removeAmount}
              onChange={(e) => setRemoveAmount(e.target.value)}
              placeholder="0.0"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleRemoveLiquidity}
            disabled={!removeAmount || isPending || isConfirming}
            className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isPending || isConfirming ? "Processing..." : "Remove Liquidity"}
          </button>
        </div>
      )}

      {/* Status Messages */}
      <div className="mt-4 space-y-2">
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
              Transaction confirmed successfully!
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
