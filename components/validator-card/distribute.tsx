"use client";
import React from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

import { executeTransactions, prepareAirdropTransactions } from '@/app/utils/airdrop-helpers';

import { Tooltip } from "@heroui/tooltip";
import { Button } from '@heroui/button';
import { Staker } from '@/app/utils/solana-helpers';


export default function DistributeComponent({ stakerList, selectedValidator }: { stakerList: Staker[], selectedValidator: any }) {
    const { connection } = useConnection();
    const { publicKey, signAllTransactions } = useWallet();
    const handleDistribute = async (stakerList: Staker[], selectedValidator: any) => {
        const signer = publicKey;
    
        if (selectedValidator && signer) {
            try {
                const transactions = await prepareAirdropTransactions(stakerList, signer);
    
                if (!signAllTransactions) {
                    throw new WalletNotConnectedError();
                }
    
                const signedTransactions = await signAllTransactions(transactions);
                const results = await executeTransactions(connection, signedTransactions);
    
                // setTransactionStatus(results);
            } catch (error) {
                console.error("Airdrop failed:", error);
            }
        }
    };
   
    return (
        <Tooltip content="Block reward will be distributed to your stakers stake account address">
        <Button
        color="primary"
        className="px-10 py-2 text-white rounded-lg"
        onClick={() => handleDistribute(stakerList, selectedValidator)}>
            Distribute
        </Button>
        </Tooltip>
    );
}