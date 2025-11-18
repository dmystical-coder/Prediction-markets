import { PREDICTION_MARKET_ABI } from "./contract-abi";

export const PREDICTION_MARKET_ADDRESS =
  "0xf59426136302a0030c1e3f270aadfaf58a131875" as const;

export const PREDICTION_MARKET_CONFIG = {
  address: PREDICTION_MARKET_ADDRESS,
  abi: PREDICTION_MARKET_ABI,
} as const;

// Outcome enum matching the contract
export enum Outcome {
  YES = 0,
  NO = 1,
}

export const OUTCOME_LABELS = {
  [Outcome.YES]: "YES",
  [Outcome.NO]: "NO",
} as const;
