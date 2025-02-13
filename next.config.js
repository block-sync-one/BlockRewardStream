/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
    nextConfig,   
    env: {
      REACT_APP_SOLANA_RPC_HOST: process.env.REACT_APP_SOLANA_RPC_HOST,
      REACT_APP_NETWORK: process.env.REACT_APP_NETWORK
    }
  }