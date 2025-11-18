import React from "react";

export interface RaceStatusProps {
  status: string;
  eventName?: string;
  participants?: string[];
  timer?: string;
}

export function RaceStatus({
  status,
  eventName,
  participants,
  timer,
}: RaceStatusProps) {
  return (
    <section className="bg-[#161B22] border border-[#2D333B] rounded-2xl p-6 mb-8 flex flex-col gap-2">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">🏎️🏁</span>
        <h2 className="text-lg font-semibold text-[#F9FAFB]">
          {eventName || "Car Race"}
        </h2>
      </div>
      <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
        <span>
          Status: <span className="font-semibold text-[#3B82F6]">{status}</span>
        </span>
        {timer && (
          <span>
            Time left: <span className="font-mono">{timer}</span>
          </span>
        )}
      </div>
      {participants && (
        <div className="flex gap-2 text-xs text-[#6B7280]">
          <span>Participants:</span>
          {participants.map((p: string, i: number) => (
            <span key={i} className="font-mono text-[#9CA3AF]">
              {p}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
