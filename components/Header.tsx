"use client";

import { useAccount } from "wagmi";

export function Header() {
  const { address } = useAccount();

  return (
    <header className="border-b border-[#2D333B] bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <h1 className="text-lg font-semibold text-[#F9FAFB] tracking-tight">
              Prediction Market
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <appkit-button />
          </div>
        </div>
      </div>
    </header>
  );
}
