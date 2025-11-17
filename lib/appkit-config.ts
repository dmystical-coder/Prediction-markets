import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base } from "@reown/appkit/networks";
import { QueryClient } from "@tanstack/react-query";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

if (!projectId) {
  console.warn(
    "NEXT_PUBLIC_PROJECT_ID is not set. Please get a project ID from https://cloud.reown.com"
  );
}

// Create a metadata object
const metadata = {
  name: "Prediction Market",
  description: "Decentralized Prediction Market on Base",
  url: typeof window !== "undefined" ? window.location.origin : "",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: [base],
  projectId,
  ssr: true,
});

// Create Query Client
export const queryClient = new QueryClient();

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
  projectId,
  metadata,
  features: {
    analytics: true,
  },
});

export const config = wagmiAdapter.wagmiConfig;
