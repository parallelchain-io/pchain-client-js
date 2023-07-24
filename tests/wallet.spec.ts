import { expect } from "chai";
import { Keypair } from "pchain-types-js";

import { Wallet } from "../src";

describe("Wallet tests", async () => {
  let wallet: Wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it("should create accounts (keypairs) and assign the first account as the default active account", async () => {
    await wallet.create(3);
    expect(wallet.getActiveAccount()).to.eql(wallet.accounts[0]);
  });

  it("should set active accounts correctly", async () => {
    await wallet.create(3);
    wallet.setActiveAccount(wallet.accounts[2]);
    expect(wallet.getActiveAccount()).to.eql(wallet.accounts[2]);
  });

  it("should add a new keypair as the last account if there are already existing keys", async () => {
    await wallet.create(3);
    const keypair = await Keypair.generate();
    wallet.add(keypair);
    expect(wallet.getActiveAccount()).to.eql(wallet.accounts[0]);
    wallet.setActiveAccount(keypair);
    expect(wallet.getActiveAccount()).to.eql(wallet.accounts[3]);
  });
});
