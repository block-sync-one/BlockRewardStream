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
    BlockheightBasedTransactionConfirmationStrategy
} from '@solana/web3.js';
import { Staker } from './solana-helpers';


export const prepareAirdropTransactions = async (
    dropList: Staker[],
    signer: PublicKey
) => {


    const NUM_DROPS_PER_TX = 10;

    function generateTransactions(
        batchSize: number,
        dropList: Staker[],
    ): Transaction[] {
        let result: Transaction[] = [];
        const txInstructions: TransactionInstruction[] = dropList.map(drop => {
            return SystemProgram.transfer({
                fromPubkey: signer,
                toPubkey: new PublicKey(drop.account),
                lamports: drop.stake * LAMPORTS_PER_SOL,
            });
        });

        const numTransactions = Math.ceil(txInstructions.length / batchSize);
        for (let i = 0; i < numTransactions; i++) {
            let bulkTransaction = new Transaction();
            let lowerIndex = i * batchSize;
            let upperIndex = (i + 1) * batchSize;
            for (let j = lowerIndex; j < upperIndex; j++) {
                if (txInstructions[j]) bulkTransaction.add(txInstructions[j]);
            }
            result.push(bulkTransaction);
        }
        return result;
    }

    return generateTransactions(NUM_DROPS_PER_TX, dropList);
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