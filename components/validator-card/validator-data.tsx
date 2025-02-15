"use client";

import { ValidatorSelect } from "./select-validator";
import { useState, useEffect } from "react";
import {Skeleton} from "@heroui/skeleton";
import { fixedNumber } from "@/app/utils/num-helpers";
import { Validator } from "@/app/utils/solana-helpers";
import { fetchValidatorsExtended } from "@/app/utils/solana-helpers";

interface ValidatorDataProps {
  selectedValidator: Validator | null;
  setSelectedValidator: (validator: Validator | null) => void;
  numberOfStakes: number;
  numberOfActiveStake: number;
  onTotalBlockRewardChange: (totalBlockReward: number | null) => void;
  blockRewardShare: number;
}

const ValidatorData = ({ 
  selectedValidator, 
  setSelectedValidator, 
  numberOfStakes, 
  numberOfActiveStake,  
  onTotalBlockRewardChange,
  blockRewardShare 
}: ValidatorDataProps) => {
  const [blockReward, setBlockReward] = useState<number>(0);
  const [blockRewardShareCalc, setBlockRewardShareCalc] = useState<number>(0);

  useEffect(() => {

    const calcBlockRewardShare = () => {
      console.log("blockRewardShare", blockRewardShare);
      const epochsPerYear = 180;
      const blockRewardPerYearEstimate = blockRewardShare * epochsPerYear;
      const projectApy = blockRewardPerYearEstimate / numberOfActiveStake * 100;

      setBlockRewardShareCalc(projectApy);
    };

    calcBlockRewardShare();
  }, [blockReward, blockRewardShare, numberOfActiveStake]);

  useEffect(() => {
    // console.log("selectedValidator", selectedValidator, numberOfStakes);
    if (selectedValidator === null) {
      setBlockReward(0);
    } else {
      fetchValidatorsExtended(selectedValidator.vote_identity)
        .then(data => {
          onTotalBlockRewardChange(data.total_block_rewards_after_burn);
          setBlockReward(data.total_block_rewards_after_burn);
        })
        .catch(error => {
          console.error("Error fetching validator rewards:", error);
          setBlockReward(0);
        });
    }
  }, [selectedValidator]);
  
  return (

          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className={`${selectedValidator ? 'col-span-5' : 'col-span-12'} space-y-2`}>
                <div className="flex flex-col">
                  <ValidatorSelect onValidatorSelect={setSelectedValidator} />
                </div>
              </div>
              {selectedValidator ? (
                <div className="grid grid-cols-3 gap-4 col-span-7">
                  <div className="">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Total Staked</span>
                      <span className="font-medium">
                        {fixedNumber(numberOfActiveStake) || <Skeleton className="h-6 w-24" />}
                      </span>
                    </div>
                  </div>
                  <div className="">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Number of Stakers</span>
                      <span className="font-medium">
                        { fixedNumber(numberOfStakes) || <Skeleton className="h-6 w-24" />}
                      </span>
                    </div>
                  </div>
                  <div className=" ">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Prev. Epoch Block Reward</span>
                      <span className="font-medium">
                        {blockReward ? `${fixedNumber(blockReward)} SOL` : <Skeleton className="h-6 w-24" />}
                      </span>
                    </div>
                  </div>
                  <div className="">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Inflation APY</span>
                      <span className="font-medium">
                        {fixedNumber(selectedValidator.apy_estimate) + '%' || <Skeleton className="h-6 w-24" />}
                      </span>
                    </div>
                  </div>
                  <div className="">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Jito APY</span>
                      <span className="font-medium">
                        {fixedNumber(selectedValidator.jito_apy) + '%' || <Skeleton className="h-6 w-24" />}
                      </span>
                    </div>
                  </div>
                  <div className="">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Block Reward APY</span>
                      <span className="font-medium text-primary">
                        { `${fixedNumber(blockRewardShareCalc)}%` }
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
  
          </div>

  );
};

export default ValidatorData;
