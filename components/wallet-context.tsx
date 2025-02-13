'use client'
import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';


// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import { StakeGroupWrapper } from './stake-group-wrapper';

export const Wallet: FC = () => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    // const network = WalletAdapterNetwork.Devnet;

    // // You can also provide a custom RPC endpoint.
    // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const network = process.env.REACT_APP_NETWORK as WalletAdapterNetwork;
    const endpoint = process.env.REACT_APP_SOLANA_RPC_HOST;
    console.log(network, endpoint);
    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/anza-xyz/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint as string}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <StakeGroupWrapper />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>

        // <ConnectionProvider endpoint={endpoint as string}>
        //     <WalletProvider wallets={wallets}>
        //         <WalletModalProvider>
        //         <StakeGroupWrapper children={
        //             <WalletMultiButton
        //                style={{ 
        //                 backgroundColor: 'var(--primary)',
        //                 color: 'var(--light)'
        //             }}>
        //                 Connect Wallet
        //             </WalletMultiButton>}/>
        //             { /* Your app's components go here, nested within the context providers. */ }
        //         </WalletModalProvider>
        //     </WalletProvider>
        // </ConnectionProvider>
    );
};