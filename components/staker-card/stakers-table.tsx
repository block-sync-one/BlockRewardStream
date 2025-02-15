"use client";
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
import { useState, useEffect } from "react"
import { AsyncListData } from "@react-stately/data";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { fixedNumber, formatScientificToDecimal } from "@/app/utils/num-helpers";
import { fetchDelegators, Staker } from "@/app/utils/solana-helpers";

interface StakersTableProps {
    validatorVoteId: string;
    sharedBlockReward?: number; // Optional prop for reward sharing percentage
    setStakerList: (stakerList: Staker[]) => void;
    setNumberOfActiveStake: (numberOfActiveStake: number) => void;
}




export const StakersTable = ({ validatorVoteId, sharedBlockReward = 0, setStakerList, setNumberOfActiveStake }: StakersTableProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [previousVoteId, setPreviousVoteId] = useState(validatorVoteId);
    const { connection } = useConnection();
    const list: AsyncListData<Staker> = useAsyncList<Staker>({
        async load() {

            try {
                // If only sharedBlockReward changed, recalculate rewards using existing items
                if (previousVoteId === validatorVoteId && list.items.length > 0) {
                    console.log("recalculating rewards using existing items");
                    const updatedItems = list.items.map(item => ({
                        ...item,
                        sharedReward: formatScientificToDecimal((item.stake / list.items.reduce((acc, curr) => acc + curr.stake, 0)) * sharedBlockReward)   
                    }));
                    return { items: updatedItems };
                }
                setIsLoading(true);
                
                const stakersData = await fetchDelegators(connection, validatorVoteId);

                // Calculate total stake
                const totalStake = stakersData.reduce((acc, curr) => acc + curr.stake, 0);
              
                // Update shared rewards based on proportion of total stake
                const updatedStakersData = stakersData.map(staker => ({
                    ...staker,
                    sharedReward: formatScientificToDecimal((staker.stake / totalStake) * sharedBlockReward)
                }));
                
                setStakerList(updatedStakersData);
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
        setStakerList([]);
        setNumberOfActiveStake(0);
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
                        <TableCell>{fixedNumber(item.stake)}</TableCell>
                        <TableCell className="text-center">
                            <span className="text-primary">{fixedNumber(item.sharedReward)}</span>
                        </TableCell>
            
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

