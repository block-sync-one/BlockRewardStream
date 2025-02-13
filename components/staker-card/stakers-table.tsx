"use client";
import { Card } from "@heroui/card";
import { CardBody, CardHeader } from "@heroui/card";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@heroui/table";
import {Spinner} from "@heroui/spinner";
import {useAsyncList} from "@react-stately/data";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { useState, useEffect } from "react"
import { AsyncListData } from "@react-stately/data";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";

interface StakersTableProps {
    validatorVoteId: string;
    sharedBlockReward?: number; // Optional prop for reward sharing percentage
    setNumberOfStakes: (numberOfStakes: number) => void;
    setNumberOfActiveStake: (numberOfActiveStake: number) => void;
}

interface StakeRecord {
    wallet: string;
    account: string;
    stake: number;
    sharedReward: number;
}

// New component for SharedRewardCell
const SharedRewardCell = ({ stake, totalStake, sharedBlockReward }: { stake: number, totalStake: number, sharedBlockReward: number }) => {
    const sharedReward = (stake / totalStake) * sharedBlockReward;
    return (
        <TableCell className="text-right text-primary">{sharedReward}</TableCell>
    );
};

export const StakersTable = ({ validatorVoteId, sharedBlockReward = 0, setNumberOfStakes, setNumberOfActiveStake }: StakersTableProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [previousVoteId, setPreviousVoteId] = useState(validatorVoteId);
    const { connected, publicKey }: any = useWallet();
    const { connection } = useConnection();
    const list: AsyncListData<StakeRecord> = useAsyncList<StakeRecord>({
        async load() {

            try {
                // If only sharedBlockReward changed, recalculate rewards using existing items
                if (previousVoteId === validatorVoteId && list.items.length > 0) {
                    console.log("recalculating rewards using existing items");
                    const updatedItems = list.items.map(item => ({
                        ...item,
                        sharedReward: (item.stake / list.items.reduce((acc, curr) => acc + curr.stake, 0)) * sharedBlockReward
                    }));
                    return { items: updatedItems };
                }
                setIsLoading(true);
                const currentEpoch = (await connection.getEpochInfo()).epoch;
                const config = {
                    filters: [{
                        memcmp: {
                            offset: 124,
                            bytes: validatorVoteId,
                        }
                    }]
                };

                const delegatorsParsed = await connection.getParsedProgramAccounts(
                    new PublicKey('Stake11111111111111111111111111111111111111'),
                    config
                );
                
                const stakersData = delegatorsParsed
                .filter(account =>
                    Number((account.account.data as any)['parsed'].info.stake.delegation.deactivationEpoch) > currentEpoch
                )
                .map(account => {
                    const accountData = (account.account.data as any)['parsed'].info;
                    const stakeAmount = accountData.stake.delegation.stake / LAMPORTS_PER_SOL;
                    return {
                        wallet: accountData.meta.authorized.withdrawer,
                        account: account.pubkey.toBase58(),
                        stake: stakeAmount,
                        sharedReward: 0, // Initialize to 0, will update after calculating total stake
                    };
                })
                .sort((a, b) => b.stake - a.stake);

                // Calculate total stake
                const totalStake = stakersData.reduce((acc, curr) => acc + curr.stake, 0);
                console.log("totalStake", totalStake);

                // Update shared rewards based on proportion of total stake
                const updatedStakersData = stakersData.map(staker => ({
                    ...staker,
                    sharedReward: (staker.stake / totalStake) * sharedBlockReward
                }));
                
                setNumberOfStakes(stakersData.length);
                setNumberOfActiveStake(totalStake)
                setIsLoading(false);
                setPreviousVoteId(validatorVoteId);
                return { items: updatedStakersData };
            } catch (error) {
                console.warn(error);
                setIsLoading(false);
                return { items: [] };
            }
        }
    });

    useEffect(() => {
        console.log("validatorVoteId", validatorVoteId);
        setNumberOfStakes(null as any);
        setNumberOfActiveStake(null as any);
        list.reload();
    }, [validatorVoteId]);

    useEffect(() => {
        if (previousVoteId === validatorVoteId && list.items.length > 0) {
            list.reload();
        }
    }, [sharedBlockReward]);

    return (
        <Table aria-label="Stakers table">
            <TableHeader>
                <TableColumn>Wallet</TableColumn>
                <TableColumn>Account</TableColumn>
                <TableColumn>Stake (SOL)</TableColumn>
                <TableColumn>Shared Block Reward</TableColumn>
            </TableHeader>
            <TableBody
                isLoading={isLoading}
                items={list.items}
                loadingContent={<Spinner label="Loading..." />}
            >
                {(item) => (
                    <TableRow key={item.account}>
                        <TableCell>{item.wallet}</TableCell>
                        <TableCell>{item.account}</TableCell>
                        <TableCell>{item.stake}</TableCell>
                        <TableCell>{item.sharedReward}</TableCell>
            
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

