import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"


import { Connection } from "@solana/web3.js"
export interface Staker {
    wallet: string;
    account: string;
    stake: number;
    sharedReward: number;
}

interface validatorExtraInfo {
    _Trillium_Attribution: string
    activated_stake: number
    // asn: number
    asn_org: string
    avg_credit_per_voted_slot: number
    avg_cu_per_block: number
    avg_mev_per_block: number
    avg_priority_fees_per_block: number
    avg_rewards_per_block: number
    avg_signature_fees_per_block: number
    avg_stake_per_leader_slot: number
    avg_tx_per_block: number
    avg_user_tx_per_block: number
    avg_vote_tx_per_block: number
    blocks_produced: number
    city: string
    client_type: number
    commission: number
    continent: string
    country: string
    cu: number
    details: any
    epoch: number
    epoch_credits: number
    icon_url: string
    identity_pubkey: string
    ip: string
    jito_rank: number
    keybase_username: any
    leader_slots: number
    logo: string
    max_vote_latency: number
    mean_vote_latency: number
    median_vote_latency: number
    mev_commission: any
    mev_earned: any
    mev_to_validator: number
    name: string
    region: string
    rewards: number
    signatures: number
    skip_rate: number
    stake_percentage: number
    superminority: number
    total_block_rewards_after_burn: number
    total_block_rewards_before_burn: number
    tx_included_in_blocks: number
    user_tx_included_in_blocks: number
    validator_priority_fees: number
    validator_signature_fees: number
    version: string
    vote_account_pubkey: string
    vote_cost: number
    vote_credits: number
    vote_credits_rank: number
    vote_tx_included_in_blocks: number
    voted_slots: number
    votes_cast: number
    vt_epoch: number
    website: string
  }
  export interface Validator extends validatorExtraInfo {
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
export const fetchValidators = async (): Promise<Validator[]> => {
  const response = await fetch("https://api.stakewiz.com/validators");
  if (!response.ok) {
    throw new Error("Failed to fetch validators");
  }
  const data = await response.json();
  return data; // Return the raw data, filtering and sorting can be done in the component
};
export const fetchValidatorsExtended = async (voteIdentity: string): Promise<validatorExtraInfo> => {
  const response = await fetch(`https://api.trillium.so/validator_rewards/${voteIdentity}`);
  if (!response.ok) {
    throw new Error("Failed to fetch validators");
  }
  const data:validatorExtraInfo[] = await response.json();
  const previousEpochValidatorData = data[0];
  return previousEpochValidatorData; // Return the raw data, filtering and sorting can be done in the component
};

export const fetchDelegators = async (
  connection: Connection,
  validatorVoteId: string,
  currentEpoch: number
): Promise<Staker[]> => {
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

  return delegatorsParsed
    .filter(account =>
      Number((account.account.data as any)['parsed'].info?.stake?.delegation?.deactivationEpoch) > currentEpoch
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
};
  