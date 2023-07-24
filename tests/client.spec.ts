import { expect } from "chai";

import { stub } from "sinon";
import { Client } from "../src/client";
import {
  SubmitTransactionRequest,
  Transaction,
  ValidatorSetsRequest,
  Command,
  PublicAddress,
  Keypair,
  PrivateKey,
  Block,
  SubmitTransactionError,
  TransactionRequest,
  Sha256Hash,
  DepositsRequest,
  Deposit,
  ReceiptRequest,
  BlockRequest,
  Option,
  Transfer,
  CommandReceipt,
  ValidatorSet,
  TransactionResponse,
  DepositsResponse,
  ReceiptResponse,
  ValidatorSetsResponse,
  BlockResponse,
  Receipt,
  HighestCommittedBlockResponse,
} from "pchain-types-js";
import BN from "bn.js";

describe("Client", async () => {
  let client: Client;
  const testURL = "https://pchain-test-rpc02.parallelchain.io";
  // disable the stubs to test against real testnet RPC

  beforeEach(() => {
    client = new Client(testURL);
  });

  it("should get and set provider", async () => {
    expect(client.getProvider()).to.eql(testURL);
    client.setProvider("mockURLTwo");
    expect(client.getProvider()).to.eql("mockURLTwo");
  });

  it("should check provider up", async () => {
    stub(client.networking, "get_response").resolves("ParallelChain F Mainnet Fullnode RPC.");
    const isUp = await client.is_provider_up();
    expect(isUp).to.eql(true);
  });

  it("should get highest commited block", async () => {
    stub(client.networking, "get_response").resolves(
      Buffer.from("AZGaIMrfrmZzpzePaONOTGggtFnn0jzKZGbK6MZNC2l9", "base64")
    );
    const response = await client.highest_committed_block();
    expect(response).to.be.instanceOf(HighestCommittedBlockResponse);
    expect(response.block_hash).to.be.instanceOf(Option);
    expect(response.block_hash.value?.toBase64url()).to.eql(
      "kZogyt-uZnOnN49o405MaCC0WefSPMpkZsroxk0LaX0"
    );
  });

  it("should query block", async () => {
    stub(client.networking, "post_response").resolves(
      Buffer.from(
        "AUy3wR9LbCe2TgztATXUDatPEu7AhN2TSZ1LzG2kIymlM3ULAAAAAAAAAAAAAAAAAL52CwAAAAAA3l41Wx4PBe/6vPK7bqvR/w/0HFemI8DKtHj9ux9z/O4ACgAAAAHskC1lgNvEDN6lfMZh081JAqdbeqFqnbH+5Aw80WwTPov1+GzPr14fiOEVL8Hev0TjYMWZxbqd/FVHmi22UCsIAZU5lvf8kk29nPZqQs68LsxXW4MWG5VwUnPZMKzCaomSti9zL2E4advxjZrl2jOiETEocv5oubw61Ny06NzuPQoBJ5SFuH/1pTDypYD29YrXwJ175gkG34BKUylDuJvjiql0VmmbFKCD7aJFOjaHFm8wdR8G0gDpOG77KrDNOE4dBQFs36jcswZSnNdQElmsqM2snP+BKh2T1FGiZbsxi1sF0OSwcElPOUpXXg42QnUxh4R2+1fS2fJw5zxyIBMjNtEMAe9XPosQcr0UDqU50WIE+X+qL+5JuqBdTv5h6O0simCiuGAsZMJ6MkRE8o0TQdASZqIzVAWP7B3Z7Pr0yIh7BwQBJNBYlcylfSG3IBQCQeEgWrurqnJKcIUZ0vyz2QhYajLjurT0ZE7NUUozsn4DNgykiVPxu8LR1mIa8ALQ3lS4BQFS94F2eoaqXI4lv8OnzakDO60llsx6coAV8nWp7wC/mwx2Zs5XGeJSemGAVcz8mgIkAVeM3oJWsSOhIoc4+TkDAAFDgvpWsbiXxkA11dIFeQocHwKYtqVclxZL4bQuJfo1eCPItBtQOpsAGniFfr5jYlyuK2qQcRd8mV/vYY7E5koIAc2UQOZ2HwYxQyPxDgZ0kGqVXuQJeqCG2b3cW1stvmxZ7v7ocSz1ssSrGQPcou+eG61kysBThhb7VtaD9566QgX1OIjJLwgWLVg9m9NHm+lRDKHXxSzN9FOisUgQ1R2FuwAAAAAAAAAAo7iyYZaaVT6Z9U5HMjR01Zj1/Q5ejzrsrVQhA03BmIJDt4pkCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACl/WtJ/X1z+GanTTKw07KxszyPR/E3AEL9sFPYnDAnKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
        "base64"
      )
    );
    const response: BlockResponse = await client.block(
      new BlockRequest({
        block_hash: new Sha256Hash("TLfBH0tsJ7ZODO0BNdQNq08S7sCE3ZNJnUvMbaQjKaU"),
      })
    );

    const blockOpt = response.block;
    expect(blockOpt).to.be.instanceOf(Option);
    const block = blockOpt.value;
    expect(block).to.be.instanceOf(Block);
    expect(block?.blockHeader?.hash.toBase64url()).to.eql(
      "TLfBH0tsJ7ZODO0BNdQNq08S7sCE3ZNJnUvMbaQjKaU"
    );

    expect(block?.blockHeader?.proposer).to.be.instanceOf(PublicAddress);
    expect(block?.blockHeader?.proposer.toBase64url()).to.eql(
      "o7iyYZaaVT6Z9U5HMjR01Zj1_Q5ejzrsrVQhA03BmII"
    );
  });

  it("should query validator sets", async () => {
    stub(client.networking, "post_response").resolves(
      Buffer.from(
        "AAEBCgAAAPxtpgDSDSWVCHbpEugd82eN7LfRw3tx40oYCTlDTIgHMHYFMUkLAAAAAfxtpgDSDSWVCHbpEugd82eN7LfRw3tx40oYCTlDTIgHAKByThgJAACgrwq937ZxZiWhBo82Ua0bdDl1XokUrNWtc4CEFG3mG4zA/GSOCwAAAAGgrwq937ZxZiWhBo82Ua0bdDl1XokUrNWtc4CEFG3mGwCgck4YCQAAR5aexUGcjnUwYuy7JrffNb8hsdmEllWEoMoodJ4s3xQSr3t/pAsAAAABR5aexUGcjnUwYuy7JrffNb8hsdmEllWEoMoodJ4s3xQAoHJOGAkAAMxT3WtGQNOegqIquQhvS9YkW25rn3KSAJ/a848x6oAAenWCqPQMAAAAAcxT3WtGQNOegqIquQhvS9YkW25rn3KSAJ/a848x6oAAAKByThgJAAD00ryUKxu4m1ycvGdfOY8fXZGd846EMIvG9/mGprpRaYG+WiJpZgAAAAH00ryUKxu4m1ycvGdfOY8fXZGd846EMIvG9/mGprpRaQCgck4YCQAAIiJoIUHLuuBUHyGHU2/rGSyoHBZ3LQNqI5dgo6ff0k6q8EROxwsAAAABIiJoIUHLuuBUHyGHU2/rGSyoHBZ3LQNqI5dgo6ff0k4AoHJOGAkAADehtKavrhRFbfjrwyWSW0aMbNcH+27ENuQS9yJnnQVbu7JaheMLAAAAATehtKavrhRFbfjrwyWSW0aMbNcH+27ENuQS9yJnnQVbAKByThgJAADHt6LLAf/xhUdCRKCNmTcRd0tTcUajhVpX/qqL6HM4opqAgkMmDwAAAAHHt6LLAf/xhUdCRKCNmTcRd0tTcUajhVpX/qqL6HM4ogCgck4YCQAAo7iyYZaaVT6Z9U5HMjR01Zj1/Q5ejzrsrVQhA03BmIJ+dpTtEWUAAAABo7iyYZaaVT6Z9U5HMjR01Zj1/Q5ejzrsrVQhA03BmIIAoHJOGAkAACCw68wVb1UaoSzRrBO3iSVuygOLy1NtHyli/KGW0vBrs+x/OTmMCQAAASCw68wVb1UaoSzRrBO3iSVuygOLy1NtHyli/KGW0vBrAKByThgJAAAAqiJ+lQQL/1VxX3z9odpk333+ZXeaxgdr0etToS5JIuI=",
        "base64"
      )
    );
    const response: ValidatorSetsResponse = await client.validator_sets(
      new ValidatorSetsRequest({
        include_prev: false,
        include_prev_delegators: false,
        include_curr: true,
        include_curr_delegators: false,
        include_next: false,
        include_next_delegators: false,
      })
    );

    expect(response.prev_validator_set).to.be.instanceOf(Option);
    expect(response.prev_validator_set.value).to.eql(null);

    expect(response.curr_validator_set).to.be.instanceOf(Option);
    expect(response.curr_validator_set.value).to.be.instanceOf(ValidatorSet);

    const validatorSet = response.curr_validator_set?.value;

    const poolsWithoutDelegator = validatorSet?.poolsWithoutDelegator || [];
    expect(poolsWithoutDelegator.length).to.eql(10);

    expect(response.block_hash.toBase64url()).to.eql("qiJ-lQQL_1VxX3z9odpk333-ZXeaxgdr0etToS5JIuI");
  });

  it("should submit a transaction", async () => {
    stub(client.networking, "post_response").resolves(Buffer.from("AQI=", "base64"));
    // dummy keys
    const keypair1 = new Keypair(
      new PublicAddress("6vvYQ-UezWtH8cVGiq_vA2rW4gl0i13ykTn8IdEKo6U"),
      new PrivateKey("m2r_l0Bo1CgjYhTDv0nngUGTiRKWDz3rf5HYv-WWObI")
    );

    const keypair2 = new Keypair(
      new PublicAddress("BsMzURgVIZoSxn3NfxyMlktmvFeajOGJk_rtP8wU9oA"),
      new PrivateKey("3OV7nQ-MWW7Ui-FVibKdiBaMlkSOG-qCe5mAsZXxGF4")
    );

    const transaction = new Transaction({
      commands: [
        new Command({
          transfer: new Transfer({ amount: new BN("99"), recipient: keypair2.public_key }),
        }),
      ],
      signer: keypair1.public_key,
      nonce: 1,
    });

    const signedTx = await transaction.toSignedTx(keypair1);
    expect(await signedTx.verifySignature(keypair1)).to.eql(true);

    const response = await client.submit_transaction(
      new SubmitTransactionRequest({ transaction: signedTx })
    );
    expect(response.error).to.be.instanceOf(Option);
    expect(response.error.value).to.eql(SubmitTransactionError.Other);
  });

  it("should query a transaction", async () => {
    stub(client.networking, "post_response").resolves(
      Buffer.from(
        "AYchXkESPY4EEzCl6idD8iKTJsKaKjynqZDqR3u82GswDwAAAAAAAAABAAAACaO4smGWmlU+mfVORzI0dNWY9f0OXo867K1UIQNNwZiCAKkNrgQAAAAACT0AAAAAAAgAAAAAAAAAAAAAAAAAAABvx/cB3FncHBpoYCaRv9SLzSrSxfTAmHNzDQh1Qs45Nq7yxOWLvOT5zl852wZiCuHWsj/BLPhwl3pI886w0FUGDjBrTH8T75YE7+rEQqqG6NwgCi6EVEUYB4QIscSyq48BAQAAAAEIdQAAAAAAAAAAAAAAAAAAAeQPXz8ez4JULUTiS0ipWn6rbm0ogq6K8EH/OWwiTyUTAQAAAAA=",
        "base64"
      )
    );
    const txResponse: TransactionResponse = await client.transaction(
      new TransactionRequest({
        transaction_hash: new Sha256Hash("DjBrTH8T75YE7-rEQqqG6NwgCi6EVEUYB4QIscSyq48"),
        include_receipt: true,
      })
    );
    expect(txResponse.block_hash).to.be.instanceOf(Option);
    expect(txResponse.block_hash.value?.toBase64url()).to.eql(
      "5A9fPx7PglQtROJLSKlafqtubSiCrorwQf85bCJPJRM"
    );

    expect(txResponse.transaction).to.be.instanceOf(Option);
    const tx = txResponse.transaction.value;
    expect(tx).to.be.instanceOf(Transaction);
    expect(tx?.signer.toBase64url()).to.eql("hyFeQRI9jgQTMKXqJ0PyIpMmwpoqPKepkOpHe7zYazA");

    expect(tx?.commands).to.be.instanceOf(Array);
    expect(tx?.commands.length).to.eql(1);
    expect(tx?.commands[0]).to.be.instanceOf(Command);
    expect(tx?.commands[0].enum).to.eql("withdrawDeposit");

    const withdrawDeposit = tx?.commands[0].withdrawDeposit;
    expect(withdrawDeposit?.operator.toBase64url()).to.eql(
      "o7iyYZaaVT6Z9U5HMjR01Zj1_Q5ejzrsrVQhA03BmII"
    );
    expect(withdrawDeposit?.max_amount.toString()).to.eql("20100000000");
    expect(txResponse.receipt).to.be.instanceOf(Option);
    const rcp = txResponse.receipt.value;
    expect(rcp).to.be.instanceOf(Receipt);
    const commandReceipts = rcp?.command_receipts;
    expect(commandReceipts?.length).to.eql(1);
    expect(commandReceipts?.[0]).to.be.instanceOf(CommandReceipt);

    expect(commandReceipts?.[0].exit_status).to.eql(1);
    expect(commandReceipts?.[0].gas_used.toString()).to.eql("29960");
  });

  it("should query deposits", async () => {
    stub(client.networking, "post_response").resolves(
      Buffer.from(
        "AQAAAKCvCr3ftnFmJaEGjzZRrRt0OXVeiRSs1a1zgIQUbeYboK8Kvd+2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hsBoK8Kvd+2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs/Ho69RAkAAACBIW6nyq89ujRbZaMINrZu7rYJPZ43SbHb2VgCElvmGQ==",
        "base64"
      )
    );
    const response: DepositsResponse = await client.deposits(
      new DepositsRequest({
        stakes: new Set([
          [
            new PublicAddress("oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"),
            new PublicAddress("oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"),
          ],
        ]),
      })
    );
    const deposits = response.deposits;
    expect(deposits).to.be.instanceOf(Map);
    expect(deposits.size).to.eql(1);

    const ownerBytes = new PublicAddress("oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs").toBytes();

    for (const key of deposits.keys()) {
      expect(key[0]).to.be.instanceOf(PublicAddress);
      expect(key[0]).to.be.instanceOf(PublicAddress);
      expect(key[0].toBytes()).to.eql(ownerBytes);
      expect(key[1].toBytes()).to.eql(ownerBytes);
      const depositOpt = deposits.get(key);
      expect(depositOpt).to.be.instanceOf(Option);
      const deposit = depositOpt?.value;
      expect(deposit).to.be.instanceOf(Deposit);
      expect(deposit?.balance.toString()).to.eql("10190842633791");
      expect(deposit?.auto_stake_rewards).to.eql(false);

      expect(deposit?.owner).instanceOf(PublicAddress);
      expect(deposit?.owner.toBytes()).to.eql(ownerBytes);
    }

    expect(response.block_hash.toBase64url()).to.eql("gSFup8qvPbo0W2WjCDa2bu62CT2eN0mx29lYAhJb5hk");
  });

  it("should query receipts", async () => {
    stub(client.networking, "post_response").resolves(
      Buffer.from(
        "vAjl4YG8CTlt0w+IOgio+NFPkmymtKF5fmmp9BphqzABAQAAAAA0gAAAAAAAAAAAAAAAAAAAAfVE9jdIcra+qdC6RTDIqB/qp1U7ZwsgeqXt6Epi+5rbAQAAAAA=",
        "base64"
      )
    );
    const response: ReceiptResponse = await client.receipt(
      new ReceiptRequest({
        transaction_hash: new Sha256Hash("vAjl4YG8CTlt0w-IOgio-NFPkmymtKF5fmmp9BphqzA"),
      })
    );

    const reciepts = response.receipt.value;
    expect(reciepts).to.be.instanceOf(Receipt);
    expect(reciepts?.command_receipts.length).to.eql(1);

    const commandReceipt = reciepts?.command_receipts?.[0];
    expect(commandReceipt?.exit_status).to.eql(0);
    expect(commandReceipt?.gas_used.toString()).to.eql("32820");

    expect(response.block_hash).to.be.instanceOf(Option);
    expect(response.block_hash?.value?.toBase64url()).to.eql(
      "9UT2N0hytr6p0LpFMMioH-qnVTtnCyB6pe3oSmL7mts"
    );
  });
});
