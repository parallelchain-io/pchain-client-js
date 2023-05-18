const { Client } = require('./lib/index');
const { Crypto } = require('./lib/utils/crypto');
const { Keypair, bytesToBase64Url } = require('pchain-types-js');
const nacl = require('tweetnacl');

const pchain_client = new Client('https://service.parallelchain.io');

const test = async()=>{
    // -------------------------------Wallet Tests-------------------------------
    
    // Create new wallet
    const wallet = pchain_client.wallet;
    // Create 3 accounts
    await wallet.create(3);
    // get active account
    let activeAccount = wallet.getActiveAccount();
    // set active account
    wallet.setActiveAccount(wallet.accounts[2]);
    activeAccount = wallet.getActiveAccount();
    // Generate new keypair
    const keypair = await Keypair.generate();
    // Add keypair to wallet
    wallet.add(keypair);
    wallet.setActiveAccount(keypair);

    console.log('Wallet Tests', true);

    // -------------------------------Crypto tests-------------------------------

    const hash = Crypto.hash(Buffer.from('I love ParallelChain'));
    console.log('Crypto Tests', hash.toBase64url() == 'jisoQ4ZrNlEFLx_5NhsyZRVir7fM8Wwg49KaV1Aj_EU');

    // -------------------------------Keypair tests-------------------------------

    // To: Sign using nacl vs sign using ed
    // console.log(keypair);
    const sign_nacl = nacl.sign.detached(Buffer.from('I love ParallelChain'), new Uint8Array([...keypair.private_key.toBytes(), ...keypair.public_key.toBytes()]));
    const signedMessage = await keypair.sign(Buffer.from('I love ParallelChain'));
    console.log('Keypair Tests', signedMessage.toBase64url() == bytesToBase64Url(sign_nacl));
    // const verify = nacl.verify(signedMessage, 'I love ParallelChain');
    // console.log(verify);
};

test();