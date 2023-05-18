import BN from 'bn.js';
import crypto from 'crypto';
import { Sha256Hash, Keypair, Signature, PublicAddress } from "pchain-types-js";
import { NumberType, serializeNum } from 'pchain-types-js/lib/crypto';

export interface Crypto {
    hash: (message: Uint8Array) => Sha256Hash;
    generateKeypair: (message: Uint8Array) => Promise<Keypair>;
    sign: (keypair: Keypair, message: string) => Promise<Signature>;
}

export class Crypto {
    /**
     * @param message input message to the hash function
     * @returns computed sha256 hash of the message
     */
    static hash = (message:Uint8Array): Sha256Hash => {
        let h1 = crypto.createHash('sha256').update(message);
        let h2 = h1.digest();
        let h3 = new Sha256Hash(h2);
        return h3;
    }

    /**
     * @param seed the seed input to keypair generation function
     * @returns keypair generated from seed
     */
    static generateKeypair = async (seed: Uint8Array | Buffer) => {
        seed = new Uint8Array(seed);
        let keypair = await Keypair.generate();
        return keypair;
    }

    /**
     * @param keypair the keypair to be used to sign the message
     * @param message message to be signed
     * @returns cipherext cryptographically signed with exising keypair.
     */
    static sign = async (keypair: Keypair, message: string) => {
        if(keypair.public_key.toBytes().length == 32 && keypair.private_key.toBytes().length == 32){
            let serialized_message = new Uint8Array(Buffer.from(message))
            let signed_message = await keypair.sign(serialized_message);
            return signed_message;
        }
        else {
            throw Error('Failed to decode keypair');
        }
    }

    /**
     * Compute contract address from account-address and nonce
     * @param account_address account address
     * @param nonce current nonce of the account
     * @returns pchain-types.PublicAddress
     */
    static compute_contract_address = (account_address: PublicAddress, nonce: BN) => {
        let pre_image = new Uint8Array();
        const serialized_nonce = serializeNum(nonce.toString(), NumberType.u64);
        if(serialized_nonce != 'Invalid data'){
            pre_image = new Uint8Array([...pre_image, ...account_address.toBytes()]);
            pre_image = new Uint8Array([...pre_image, ...serialized_nonce]);
            return new PublicAddress(this.hash(pre_image).toBytes());
        }
        return null;
    }
}