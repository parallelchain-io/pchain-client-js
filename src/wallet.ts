import { bytesToBase64Url, Keypair } from 'pchain-types-js';
import { PublicAddress, PrivateKey } from 'pchain-types-js/lib/crypto/public_address';

/**
* Stores list of keypairs and provide methods to interact with a keypair
*/
export interface Wallet {

    accounts: Keypair[];
    active_keypair: Keypair | null;
     
    getAccountIndex: (publicKey: string) => number;
    create: (n: number) => Promise<Keypair[] >; 
    add: (keypair: Keypair) => Keypair[];
    remove: (privateKey: Uint8Array) => Keypair[];
    clear: () => void;
    getActiveAccount: () => Keypair | null;
    setActiveAccount: (keypair: Keypair) => void;
    loadKeypairsFromJson: (keypairs: File[]) => Keypair[];
}

export class Wallet { 

    accounts: Keypair[];
    active_keypair: Keypair | null;

    /**
    * Creates an instance of Wallet
    */
    constructor(){
        this.accounts = [];
        this.active_keypair = null;
    }
    
    /**
     * get the index of the account given the public key
     * @param publicKey the public key of the account 
     * @returns the index of the account in the wallet
     */
    getAccountIndex = (publicKey: string): number => {
        return this.accounts.findIndex((keypair) => publicKey == keypair.public_key.toBase64url());
    }

    /**
     * Creates n keypairs inside the wallet
     * @param n number of keypairs to create
     * @returns list of keypairs created
     */
    create = async (n:number): Promise<Keypair[] > => {
        for (let i = 0; i < n; i++) {
            const keypair: Keypair = await Keypair.generate();
            this.add(keypair);
        }
        this.active_keypair = this.accounts[0];
        return this.accounts;
    }

    /**
     * Add generated keypair to wallet instance
     * @param keypair the keypair to be added to wallet
     * @returns resulting list of keypairs in the wallet
     */
    add = (keypair: Keypair): Keypair[] => {
        if(this.accounts.length == 0){
            this.active_keypair = keypair;
        }
        this.accounts.push(keypair);
        return this.accounts;
    }

    /**
     * Removes keypair corresponding to private key from wallet instance
     * @param privateKey the private key of the account
     * @returns resulting list of keypairs in the wallet
     */
    remove = (privateKey: Uint8Array): Keypair[] => {
        this.accounts = this.accounts.filter((keypair: Keypair) => keypair.private_key.toBase64url() != bytesToBase64Url(privateKey));
        return this.accounts;
    }

    /**
     * Removes all accounts from wallet instance
     */
    clear = (): void => {
        this.accounts = [];
    }

    /**
     * Get active account in wallet instance
     * @returns the keypair of the active account
     */
    getActiveAccount = (): Keypair | null => {
        return this.active_keypair;
    }

    /**
     * Set account at supplied index as active account in wallet instance
     * @param keypair the keypair for specifying the active account
     */
    setActiveAccount = (keypair: Keypair): void => {
        try{
            this.active_keypair = keypair;
        }catch(e: any){
            throw Error(e);
        }
    }

    /**
     * Adds keypairs to accounts list by reading keypairs from a valid json files
     * @param keypairs list of files containing keypairs to be loaded
     * @returns resulting list of keypairs in the wallet
     */
    loadKeypairsFromJson = (keypairs: File[]) => {
        const reader = new FileReader();
        let new_accounts = this.accounts;
        for (let index = 0; index < keypairs.length; index++) {
            reader.readAsText(keypairs[index]);
            reader.onload = async () => {
                if(typeof reader.result == 'string'){
                    try{
                        const keypair = JSON.parse(reader.result);
                        new_accounts.push(new Keypair(new PublicAddress(keypair.public_key), new PrivateKey(keypair.private_key)));
                    }catch(e: any){
                        throw Error(e);
                    }
                }
            }
        }

        this.accounts = new_accounts;
        return this.accounts;
    }
    
}
