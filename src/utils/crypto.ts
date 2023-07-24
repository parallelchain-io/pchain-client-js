import BN from "bn.js";
import {
  Sha256Hash,
  Keypair,
  Signature,
  PublicAddress,
  generateSha256Hash,
  BinaryWriter,
} from "pchain-types-js";

export interface Crypto {
  hash: (message: Uint8Array) => Sha256Hash;
  generateKeypair: (message: Uint8Array) => Promise<Keypair>;
  sign: (keypair: Keypair, message: string) => Promise<Signature>;
}

//
// Crypto is a convenience class that wraps cryptographic operations from pchain-types-js
//
export class Crypto {
  /**
   * @param message input message to the hash function
   * @returns computed sha256 hash of the message
   */
  static hash(message: Uint8Array): Sha256Hash {
    return generateSha256Hash(message);
  }

  /**
   * Generates a keypair using machine random bytes function
   * @returns keypair generated
   */
  static async generateKeypair() {
    const keypair = await Keypair.generate();
    return keypair;
  }

  /**
   * @param keypair the keypair to be used to sign the message
   * @param message message to be signed
   * @returns cipherext cryptographically signed with exising keypair.
   */
  static async sign(keypair: Keypair, message: string) {
    if (keypair.public_key.toBytes().length == 32 && keypair.private_key.toBytes().length == 32) {
      const serialized_message = new Uint8Array(Buffer.from(message));
      const signed_message = await keypair.sign(serialized_message);
      return signed_message;
    } else {
      throw Error("Failed to decode keypair");
    }
  }

  /**
   * Compute contract address from account-address and nonce
   * @param account_address account address
   * @param nonce current nonce of the account
   * @returns pchain-types.PublicAddress
   */
  static compute_contract_address(account_address: PublicAddress, nonce: BN) {
    if (nonce.lt(new BN(0))) {
      return null;
    }
    let pre_image = new Uint8Array();
    const writer = new BinaryWriter();
    writer.writeU64(nonce);
    const serialized_nonce = writer.toArray();
    pre_image = new Uint8Array([...pre_image, ...account_address.toBytes()]);
    pre_image = new Uint8Array([...pre_image, ...serialized_nonce]);
    return new PublicAddress(this.hash(pre_image).toBytes());
  }
}
