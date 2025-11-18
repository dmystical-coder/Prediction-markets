"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MarketInfo } from "@/components/MarketInfo";
import { BuyTokens } from "@/components/BuyTokens";
import { SellTokens } from "@/components/SellTokens";
import { LiquidityManager } from "@/components/LiquidityManager";
import { RedeemWinnings } from "@/components/RedeemWinnings";
import { RoleTabs } from "@/components/RoleTabs";
import { useAccount } from "wagmi";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import {
  PREDICTION_MARKET_CONFIG,
  Outcome,
  OUTCOME_LABELS,
} from "@/lib/contract-config";

export default function Home() {
  const { isConnected } = useAccount();
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleSuccess, setOracleSuccess] = useState(false);
  const [oracleError, setOracleError] = useState<string | null>(null);
  const [oracleOutcome, setOracleOutcome] = useState<Outcome>(Outcome.YES);
  const { writeContract } = useWriteContract();

  const handleOracleReport = async () => {
    setOracleLoading(true);
    setOracleSuccess(false);
    setOracleError(null);
    try {
      await writeContract({
        ...PREDICTION_MARKET_CONFIG,
        functionName: "report",
        args: [oracleOutcome],
      });
      setOracleSuccess(true);
    } catch (err: any) {
      setOracleError(err?.message || "Failed to report result");
    } finally {
      setOracleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Header />
      <Hero />
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="max-w-md mx-auto mt-24">
            <div className="bg-[#161B22] border border-[#2D333B] rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#F9FAFB] mb-3">
                Connect Wallet
              </h2>
              <p className="text-[#9CA3AF] mb-8 leading-relaxed">
                Connect your wallet to start trading prediction tokens on Base
                Mainnet
              </p>
              <div className="flex justify-center">
                <appkit-button />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <MarketInfo />
            <RoleTabs>
              <div role="User">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <BuyTokens />
                  <SellTokens />
                </div>
                <RedeemWinnings />
              </div>
              <div role="Liquidity Provider">
                <LiquidityManager />
              </div>
              <div role="Oracle">
                <div className="bg-[#161B22] border border-[#2D333B] rounded-xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-[#F9FAFB] mb-2">
                    Oracle Actions
                  </h3>
                  <p className="text-[#9CA3AF] mb-4">
                    Report the result of the car race once it ends.
                  </p>
                  <div className="mb-4 flex flex-col items-center gap-2">
                    <label
                      htmlFor="oracle-outcome"
                      className="text-xs text-[#9CA3AF] mb-1"
                    >
                      Select Winning Outcome
                    </label>
                    <select
                      id="oracle-outcome"
                      value={oracleOutcome}
                      onChange={(e) =>
                        setOracleOutcome(Number(e.target.value) as Outcome)
                      }
                      className="px-4 py-2 rounded-xl bg-[#0D1117] border border-[#2D333B] text-[#F9FAFB]"
                    >
                      <option value={Outcome.YES}>
                        {OUTCOME_LABELS[Outcome.YES]}
                      </option>
                      <option value={Outcome.NO}>
                        {OUTCOME_LABELS[Outcome.NO]}
                      </option>
                    </select>
                  </div>
                  <button
                    className="px-6 py-3 bg-[#6366F1] text-white font-medium rounded-xl hover:bg-[#3B82F6] transition-colors"
                    onClick={handleOracleReport}
                    disabled={oracleLoading}
                  >
                    {oracleLoading ? "Reporting..." : "Report Result"}
                  </button>
                  {oracleSuccess && (
                    <p className="mt-4 text-[#10B981] text-sm">
                      Result reported successfully!
                    </p>
                  )}
                  {oracleError && (
                    <p className="mt-4 text-[#EF4444] text-sm">{oracleError}</p>
                  )}
                </div>
              </div>
            </RoleTabs>
            <div className="bg-[#161B22] border border-[#2D333B] rounded-xl p-4">
              <p className="text-xs font-medium text-[#9CA3AF] mb-2">
                Contract Address
              </p>
              <p className="font-mono text-xs text-[#6B7280] break-all mb-3">
                0xf59426136302a0030c1e3f270aadfaf58a131875
              </p>
              <a
                href="https://sepolia.etherscan.io/address/0xf59426136302a0030c1e3f270aadfaf58a131875"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#3B82F6] hover:text-[#6366F1] transition-colors inline-flex items-center gap-1"
              >
                View on Etherscan
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
