"use client";
import React from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

import { executeTransactions, prepareAirdropTransactions } from '@/app/utils/airdrop-helpers';

import { Tooltip } from "@heroui/tooltip";
import { Button } from '@heroui/button';
import { Staker } from '@/app/utils/solana-helpers';


export default function DistributeComponent({ stakerList, selectedValidator, sharedBlockReward }: { stakerList: Staker[], selectedValidator: any, sharedBlockReward: number }) {
    const { connection } = useConnection();
    const { publicKey, signAllTransactions } = useWallet();
    const handleDistribute = async (stakerList: Staker[], selectedValidator: any) => {
        const signer = publicKey;
    
        if (selectedValidator && signer) {
            try {
                // const demoList = [
                //     {
                //         "account": "5ZGQvCGVgYGCJG3gUUR5Hp3UaX3TsWCoXey4kMkTyvs5",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "CMLztvi111k3RE5xc4m5LwqUf7wdzxmiCDCqtPSZYLsn",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "HUGHyVhayM7TKdkCeYsaieiPwg2UR9xYzenEZC2khX7y",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "B7j81WVPhefuumjEciCd6yEuqhqDQd2sYFich4LvoPMy",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "7gBY6gmcLfrbHrJiv3q1NvvSSbegZKAT4dNpN75fAW19",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "EwZakPesudxxWQYBeCQdnsJiaZrCAjKEgZ9rpizpaQ7",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "3GSQdeMioU3GMgs6pSi6DKmFEMGGWihV8T6bTyLNhg8U",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "AUx7dyduWTrLd9xnAD3v2gcEvm9qT7qe8aH424fHdxUV",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "fvW8z6ZKiEPC3MZih9E423kRHLK7v9HLeD63vmRsXWv",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "BiFhoBHCcuet6JUXzsm2s34FNBaiXskq15K4GiiraJiB",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "3qJtEqVwjffrj3osFD5w2ZvjNiNhNbtqkbLLamU3qYvc",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "Gmactp37HqnRJz6utNVFyPPnCrXtpUhMYiEKjqnZTx33",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "b8aAgffxrPVM1UDggr4QysGrduWUsZNFnurJ5zVFx91",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "7EvrModhcgza9MZ7UEcPhSkYftar7KjeCazjpk2KCCpH",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "DuJgWBZ9yz2nF61iKYDM32XCgT4ZQNZqQmWGP6eVj5kF",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "7p47fDAPGkXj3xct9mR38oNtxXf1g6pkbid35yZf6izC",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "9EKyyJsPcEnvzuuah1mLGgdRFD3BW3tZDa8pLNvHSZXB",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "EnMKBeePbc1rmjxCSzkXEgLe1brzpopqYXAwPTAvHe1",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "DGeFS1V5tnc1s2Mz8a5MLG6jeF6xZvZkSucLEyQ2vzvP",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "7wLukm5NwU1Jb8gokRXvF4wbSiiJXYBnih3o9UUtAGht",
                //         "airdrop": 100
                //     },
                //     {
                //         "account": "HcH7JQ4TUhiJvmf9PXBNiS8DpM6voP3H2ror7sfrpwur",
                //         "airdrop": 100
                //     }
                // ]
                const transactions = await prepareAirdropTransactions(stakerList, signer, sharedBlockReward, connection);
                console.log(transactions);
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