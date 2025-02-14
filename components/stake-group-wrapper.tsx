"use client";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { useState, useEffect } from "react";
import { Validator, Staker } from "@/app/utils/solana-helpers";
import ValidatorData from "@/components/validator-card/validator-data";
import { StakersTable } from "@/components/staker-card/stakers-table";
import BRCalc from "@/components/validator-card/br-calc";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import {Button} from "@heroui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { fixedNumber } from "@/app/utils/num-helpers";
import DistributeComponent from "./validator-card/distribute";

export const StakeGroupWrapper = () => {
    const { connected, publicKey, disconnect }: any = useWallet();
    const { connection } = useConnection();
    const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
    const [stakerList, setStakerList] = useState<Staker[]>([]);
    const [numberOfActiveStake, setNumberOfActiveStake] = useState(0);
    const [rewardShare, setRewardShare] = useState(0);
    const [totalBlockReward, setTotalBlockReward] = useState(0);
    const [balance, setBalance] = useState<number>(0);
    const [transactionStatus, setTransactionStatus] = useState<string[]>([]);
    useEffect(() => {
        const getBalance = async () => {
            if (connected && publicKey && connection) {
                const bal = await connection.getBalance(publicKey);
                setBalance(bal / 1e9);
            }
        };
        getBalance();
    }, [connected, publicKey, connection]);

    const handleTotalBlockRewardChange = (value: number | null) => {
        setTotalBlockReward(value ?? 0);
    };

    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader className="pb-2">
                    <p className="text-sm text-gray-500">
                        current epoch: 741
                    </p>
                </CardHeader>
                <CardBody>
                    <ValidatorData
                        selectedValidator={selectedValidator}
                        setSelectedValidator={setSelectedValidator}
                        numberOfStakes={stakerList.length}
                        numberOfActiveStake={numberOfActiveStake}
                        onTotalBlockRewardChange={handleTotalBlockRewardChange}
                    />
                    {selectedValidator && (
                        <div className="m-14 flex justify-center flex-col border rounded-lg p-4">
                            <span className="text-gray-500 mb-4">Block Reward Sharing Calc</span>
                            <div className="flex justify-center">
                                <BRCalc onChangeFn={setRewardShare} totalBlockReward={totalBlockReward} />
                            </div>
                            <div className="flex flex-col items-center mt-6">
                                {!connected  && (<>
                                <span className="text-gray-500 mb-4">Want to share your block reward with your stakers?</span>
                                    <WalletMultiButton />
                                    </>
                                )}
                                
                               
                            </div>
                            {connected && publicKey && connection && (
                                    <div className="flex items-center max-w-full justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="truncate">
                                                wallet address: {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
                                            </span>
                                            <span>Balance: {fixedNumber(balance)} SOL</span>
                                            <Button 
                                                onClick={disconnect}
                                                className="text-red-500 rounded-lg bg-transparent"
                                                style={{ width: '40px', height: '40px', marginRight: '8px' }}
                                            >
                                                Disconnect
                                            </Button>
                                        </div>
                                        <DistributeComponent stakerList={stakerList} selectedValidator={selectedValidator} />
                                    </div>
                                )}
                        </div>
                    )}
                </CardBody>
            </Card>

            {selectedValidator && (
                <StakersTable
                    validatorVoteId={selectedValidator?.vote_identity ?? ""}
                    sharedBlockReward={rewardShare}
                    setStakerList={setStakerList}
                    setNumberOfActiveStake={setNumberOfActiveStake}
                />
            )}

            {transactionStatus.length > 0 && (
                <div className="mt-4">
                    <h3>Transaction Status:</h3>
                    <ul>
                        {transactionStatus.map((status, index) => (
                            <li key={index}>Transaction {index + 1}: {status}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};