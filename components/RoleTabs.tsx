import React, { useState, ReactNode } from "react";

interface RoleTabsProps {
  children: ReactNode;
}

export function RoleTabs({ children }: RoleTabsProps) {
  const [tab, setTab] = useState("User");
  const tabs = ["User", "Liquidity Provider", "Oracle"];
  return (
    <div className="mb-8">
      <div className="flex gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all border border-[#2D333B] bg-[#161B22] text-[#9CA3AF] hover:text-[#F9FAFB] ${
              tab === t ? "bg-[#0D1117] text-[#F9FAFB] border-[#3B82F6]" : ""
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div>
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            (child as React.ReactElement<{ role?: string }>).props.role === tab
          ) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
}
