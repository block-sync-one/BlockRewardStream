import { Slider } from "@heroui/slider";
import { useEffect, useState } from "react";

interface BRCalcProps {
  onChangeFn: (value: number) => void;
  totalBlockReward: number;
}

const BRCalc: React.FC<BRCalcProps> = ({ onChangeFn, totalBlockReward }) => {
  const marks = [
    { value: 25, label: '25%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' }
  ];

  return (
    <Slider
      className="max-w-lg"
      color="primary"
      defaultValue={10}
      label="Block Reward to share"
      marks={marks}
      size="sm"
      step={1}
      onChange={(value) => onChangeFn((value as number / 100) * totalBlockReward as number)}
      getValue={(value) => `${((value as number / 100) * totalBlockReward).toFixed(2)} SOL`}
      showTooltip={true}
    />
  );
};

export default BRCalc;
