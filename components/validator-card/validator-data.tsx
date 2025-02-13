"use client";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { ValidatorSelect, Validator } from "./select-validator";
import { useState, useEffect } from "react";
import {Skeleton} from "@heroui/skeleton";

interface ValidatorDataProps {
  selectedValidator: Validator | null;
  setSelectedValidator: (validator: Validator | null) => void;
  numberOfStakes: number;
  numberOfActiveStake: number;
}

const ValidatorData = ({ selectedValidator, setSelectedValidator, numberOfStakes, numberOfActiveStake,  }: ValidatorDataProps) => {
  useEffect(() => {
    console.log("selectedValidator", selectedValidator, numberOfStakes);
    // Reset numberOfStakes when validator changes
    if (selectedValidator === null) {
      // You might need to implement a way to reset numberOfStakes
      // through the parent component, for example:
      // setNumberOfStakes(0);
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
                <>
                  <div className="col-span-2 space-y-2">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Total Staked</span>
                      <span className="font-medium">
                        {numberOfActiveStake || <Skeleton className="h-6 w-24" />}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Number of Stakers</span>
                      <span className="font-medium">
                        {numberOfStakes || <Skeleton className="h-6 w-24" />}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-3 space-y-2">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Block reward earned</span>
                      <span className="font-medium">10 SOL</span>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
  
          </div>

  );
};

export default ValidatorData;
