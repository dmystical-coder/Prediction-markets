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
    <div className="bg-[#161B22] border border-[#2D333B] rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-[#2D333B]">
        <h2 className="text-lg font-semibold text-[#F9FAFB]">
          Liquidity Management
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#2D333B]">
        <button
          onClick={() => setActiveTab("add")}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "add"
              ? "text-[#F9FAFB]"
              : "text-[#6B7280] hover:text-[#9CA3AF]"
          }`}
        >
          Add Liquidity
          {activeTab === "add" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6]"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("remove")}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "remove"
              ? "text-[#F9FAFB]"
              : "text-[#6B7280] hover:text-[#9CA3AF]"
          }`}
        >
          Remove Liquidity
          {activeTab === "remove" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6]"></div>
          )}
        </button>
      </div>

      <div className="p-6">
        {/* Add Liquidity Tab */}
        {activeTab === "add" && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-3">
                ETH Amount to Add
              </label>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="0.0"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-[#0D1117] border border-[#2D333B] text-[#F9FAFB] rounded-xl focus:outline-none focus:border-[#3B82F6] transition-colors placeholder-[#6B7280] font-mono text-lg"
              />
            </div>

            <button
              onClick={handleAddLiquidity}
              disabled={!addAmount || isPending || isConfirming}
              className="w-full px-6 py-3.5 bg-[#3B82F6] text-white font-medium rounded-xl hover:bg-[#6366F1] disabled:bg-[#2D333B] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-all shadow-lg shadow-[#3B82F6]/20 disabled:shadow-none"
            >
              {isPending || isConfirming ? "Processing..." : "Add Liquidity"}
            </button>
          </div>
        )}

        {/* Remove Liquidity Tab */}
        {activeTab === "remove" && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-3">
                ETH Amount to Withdraw
              </label>
              <input
                type="number"
                value={removeAmount}
                onChange={(e) => setRemoveAmount(e.target.value)}
                placeholder="0.0"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-[#0D1117] border border-[#2D333B] text-[#F9FAFB] rounded-xl focus:outline-none focus:border-[#3B82F6] transition-colors placeholder-[#6B7280] font-mono text-lg"
              />
            </div>

            <button
              onClick={handleRemoveLiquidity}
              disabled={!removeAmount || isPending || isConfirming}
              className="w-full px-6 py-3.5 bg-[#3B82F6] text-white font-medium rounded-xl hover:bg-[#6366F1] disabled:bg-[#2D333B] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-all shadow-lg shadow-[#3B82F6]/20 disabled:shadow-none"
            >
              {isPending || isConfirming ? "Processing..." : "Remove Liquidity"}
            </button>
          </div>
        )}

        {/* Status Messages */}
        <div className="mt-5 space-y-3">
          {hash && (
            <div className="p-3 bg-[#0D1117] border border-[#2D333B] rounded-lg">
              <p className="text-xs text-[#9CA3AF] mb-1">Transaction Hash</p>
              <p className="font-mono text-xs text-[#6B7280] break-all">
                {hash}
              </p>
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
    </div>
  );
}
