import React from "react";

export function Hero() {
  return (
    <section className="w-full py-14 md:py-20 bg-[#0D1117] border-b border-[#2D333B]">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center gap-6">
        <h1
          className="text-4xl md:text-5xl font-extrabold text-[#F9FAFB] leading-tight mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Trade on real-world events in real time.
        </h1>
        <p className="text-lg md:text-xl text-[#9CA3AF] font-normal max-w-2xl mb-2">
          Bet on the outcome of the car race, buy and sell outcome shares while
          the race is live, and redeem your winnings instantly when the result
          is reported. Powered by a simple, transparent protocol for users,
          liquidity providers, and oracles.
        </p>
      </div>
    </section>
  );
}
