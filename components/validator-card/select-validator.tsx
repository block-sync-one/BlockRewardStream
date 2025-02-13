"use client";

import { Key, useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import {
    Autocomplete,
    AutocompleteSection,
    AutocompleteItem
    } from "@heroui/autocomplete";
    
export interface Validator {
    rank: number
    identity: string
    vote_identity: string
    last_vote: number
    root_slot: number
    credits: number
    epoch_credits: number
    activated_stake: number
    version: string
    delinquent: boolean
    skip_rate: number
    updated_at: string
    first_epoch_with_stake: number
    name: string
    keybase: string
    description: string
    website: string
    commission: number
    image: string
    ip_latitude: string
    ip_longitude: string
    ip_city: string
    ip_country: string
    ip_asn: string
    ip_org: string
    mod: boolean
    is_jito: boolean
    jito_commission_bps: number
    admin_comment: any
    vote_success: number
    vote_success_score: number
    wiz_skip_rate: number
    skip_rate_score: number
    info_score: number
    commission_score: number
    first_epoch_distance: number
    epoch_distance_score: number
    stake_weight: number
    above_halt_line: boolean
    stake_weight_score: number
    withdraw_authority_score: number
    asn: string
    asn_concentration: number
    asn_concentration_score: number
    tpu_ip: string
    tpu_ip_concentration: number
    tpu_ip_concentration_score: number
    uptime: number
    uptime_score: number
    wiz_score: number
    version_valid: boolean
    city_concentration: number
    city_concentration_score: number
    invalid_version_score: number
    superminority_penalty: number
    score_version: number
    no_voting_override: boolean
    epoch: number
    epoch_slot_height: number
    asncity_concentration: number
    asncity_concentration_score: number
    skip_rate_ignored: boolean
    stake_ratio: number
    credit_ratio: number
    apy_estimate: number
    staking_apy: number
    jito_apy: number
    total_apy: number
  }
  

interface ValidatorSelectProps {
  onValidatorSelect: (validator: Validator | null) => void;
}

export const ValidatorSelect = ({ onValidatorSelect }: ValidatorSelectProps) => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    fetchValidators();
  }, []);

  const fetchValidators = async () => {
    try {
      const response = await fetch("https://api.stakewiz.com/validators");
      if (!response.ok) {
        throw new Error("Failed to fetch validators");
      }
      const data = await response.json();
      
      // Filter out delinquent validators and sort by total APY
      const activeValidators = data
        // .filter((v: Validator) => !v.delinquent)
        // .sort((a: Validator, b: Validator) => b.total_apy - a.total_apy);
      
      setValidators(activeValidators);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch validators");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChange = (key: Key | null) => {
    if (key === null) {
      onValidatorSelect(null);
      return;
    }

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