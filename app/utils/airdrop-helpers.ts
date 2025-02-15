import {
    Keypair,
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    ComputeBudgetProgram,
    sendAndConfirmTransaction,
    TransactionInstruction,
    VersionedTransaction,
    BlockheightBasedTransactionConfirmationStrategy,
    TransactionBlockhashCtor
} from '@solana/web3.js';
import { Staker } from './solana-helpers';


export const prepareAirdropTransactions = async (
    dropList: Staker[],
    signer: PublicKey,
    sharedBlockReward: number,
    SOLANA_CONNECTION: Connection
) => {
    const { lastValidBlockHeight, blockhash } = await SOLANA_CONNECTION.getLatestBlockhash();
    const txArgs: TransactionBlockhashCtor = { feePayer: signer, blockhash, lastValidBlockHeight: lastValidBlockHeight }

    const NUM_DROPS_PER_TX = 10;


        let result: Transaction[] = [];
        const totalStake = dropList.reduce((acc, curr) => acc + curr.stake, 0);
        const airdrop = dropList.map(drop => {
            return {
                account: drop.account,
                airdrop: Math.floor(((drop.stake / totalStake) * sharedBlockReward) * LAMPORTS_PER_SOL)
            }
        })
        const txInstructions: TransactionInstruction[] = airdrop.map(drop => {
            return SystemProgram.transfer({
                fromPubkey: signer,
                toPubkey: new PublicKey(drop.account),
                lamports: drop.airdrop
            });
        });

        const numTransactions = Math.ceil(txInstructions.length / NUM_DROPS_PER_TX);
        for (let i = 0; i < numTransactions; i++) {
            let bulkTransaction = new Transaction(txArgs);
            let lowerIndex = i * NUM_DROPS_PER_TX;
            let upperIndex = (i + 1) * NUM_DROPS_PER_TX;
            for (let j = lowerIndex; j < upperIndex; j++) {
                if (txInstructions[j]) bulkTransaction.add(txInstructions[j]);
            }
            result.push(bulkTransaction);
        }
        return result;

}


export async function executeTransactions(SOLANA_CONNECTION: Connection, signedTx: Transaction[]) {
    let result: string[] = [];
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second delay between retries
    // const { lastValidBlockHeight, blockhash } = await SOLANA_CONNECTION.getLatestBlockhash();
    var signatures = [];
    var successfulSignatures = [];

    // Send all transactions with retry mechanism
    for await (const tx of signedTx) {
        let retries = 0;
        let sent = false;
        while (retries < MAX_RETRIES && !sent) {
            try {
                const rawTransaction = tx.serialize({ requireAllSignatures: false });
                const confirmTransaction = await SOLANA_CONNECTION.sendRawTransaction(rawTransaction, { skipPreflight: true });
                signatures.push(confirmTransaction);
                successfulSignatures.push(confirmTransaction);
                console.log(`Transaction sent successfully: ${confirmTransaction}`);
                sent = true;
            } catch (error) {
                console.warn(`Failed to send transaction, attempt ${retries + 1}:`, error);
                retries++;
                if (retries < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                }
            }
        }
        if (!sent) {
            console.error('Transaction failed after maximum retries');
        }
    }
    return successfulSignatures;
}