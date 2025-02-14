/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
    nextConfig,   
    env: {
      SOLANA_RPC_HOST: process.env.SOLANA_RPC_HOST,
      SOLANA_NETWORK: process.env.SOLANA_NETWORK
    }
  }