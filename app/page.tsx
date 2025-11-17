"use client";

import { Header } from "@/components/Header";
import { MarketInfo } from "@/components/MarketInfo";
import { BuyTokens } from "@/components/BuyTokens";
import { SellTokens } from "@/components/SellTokens";
import { LiquidityManager } from "@/components/LiquidityManager";
import { RedeemWinnings } from "@/components/RedeemWinnings";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Prediction Market
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Connect your wallet to start trading prediction tokens on Base
              Mainnet
            </p>
            <div className="flex justify-center">
              <appkit-button />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Market Information */}
            <MarketInfo />

            {/* Trading Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BuyTokens />
              <SellTokens />
            </div>

            {/* Liquidity Management */}
            <LiquidityManager />

            {/* Redeem Winnings */}
            <RedeemWinnings />

            {/* Contract Info */}
            <div className="bg-gray-100 rounded-lg p-4 text-xs text-gray-600">
              <p className="font-semibold mb-1">Contract Address:</p>
              <p className="font-mono break-all">
                0x0b65b804663972a37b6adba0785acde21db07fff
              </p>
              <p className="mt-2">
                <a
                  href="https://basescan.org/address/0x0b65b804663972a37b6adba0785acde21db07fff"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on BaseScan →
                </a>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
