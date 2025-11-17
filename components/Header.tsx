"use client";

import { useAccount } from "wagmi";

export function Header() {
  const { isConnected, address } = useAccount();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Prediction Market
            </h1>
            <p className="text-sm text-gray-600">Powered by Base Mainnet</p>
          </div>

          <div className="flex items-center gap-4">
            {isConnected && address && (
              <div className="hidden sm:block text-sm text-gray-600">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            )}
            <appkit-button />
          </div>
        </div>
      </div>
    </header>
  );
}
