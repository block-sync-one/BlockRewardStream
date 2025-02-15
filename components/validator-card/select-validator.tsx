"use client";

import { Key, useEffect, useState } from "react";
import { Avatar } from "@heroui/avatar";
import {
    Autocomplete,
    AutocompleteItem
    } from "@heroui/autocomplete";
import { fetchValidators, Validator } from "@/app/utils/solana-helpers";
import va from '@vercel/analytics';

interface ValidatorSelectProps {
  onValidatorSelect: (validator: Validator | null) => void;
}

export const ValidatorSelect = ({ onValidatorSelect }: ValidatorSelectProps) => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");

  const fetchValidatorsData = async () => {
    try {
      const data = await fetchValidators();
      
      // Filter out delinquent validators and sort by total APY
      const activeValidators = data
        .filter((v: Validator) => !v.delinquent)
        .sort((a: Validator, b: Validator) => b.total_apy - a.total_apy);
      
      setValidators(activeValidators);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch validators");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchValidatorsData();
  }, []);

  const handleSelectionChange = (key: Key | null) => {
    if (key === null) {
      onValidatorSelect(null);
      return;
    }
    va.track('select_validator', { vote_identity: key.toString() });
    const selectedValidator = validators.find(v => v.vote_identity === key);
    onValidatorSelect(selectedValidator || null);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
  
      <Autocomplete
        label="Select a Validator"
        placeholder="Choose a validator"
        isLoading={isLoading}
        className="max-w-lg"
        itemHeight={40}
        onSelectionChange={handleSelectionChange}
        scrollShadowProps={{
          isEnabled: false,
        }}
      >
        {validators
          .filter((validator) =>
            (validator.name || validator.vote_identity)
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          )
          .map((validator) => (
            <AutocompleteItem
            
              key={validator.vote_identity}
              value={validator.vote_identity}
              textValue={validator.name || validator.vote_identity.slice(0, 8)}
            >
              <div className="flex items-center gap-2">
                <Avatar
                  alt={validator.name}
                  className="flex-shrink-0"
                  size="sm"
                  src={validator.image}
                />
                <span>{validator.name || validator.vote_identity.slice(0, 8)}</span>
              </div>
            </AutocompleteItem>
          ))}
      </Autocomplete>

  );
};