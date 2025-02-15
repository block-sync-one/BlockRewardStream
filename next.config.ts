import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    SOLANA_RPC_HOST: process.env.SOLANA_RPC_HOST,
    SOLANA_NETWORK: process.env.SOLANA_NETWORK
  }
};

export default nextConfig;
