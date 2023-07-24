import { PublicAddress } from "pchain-types-js";
import BN from "bn.js";
import { expect } from "chai";

import { Crypto } from "../../src/utils/crypto";

describe("Crypto tests", async () => {
  it("compute_contract_address should compute address correctly", () => {
    const addr = Crypto.compute_contract_address(
      new PublicAddress("oK8Kvd-2cWYloQaPNlGtG3Q5dV6JFKzVrXOAhBRt5hs"),
      new BN("47987")
    );

    expect(addr?.toBase64url()).to.eql("lu-2SF7uOB5EBNLGFkLWHzieJ4BNqxQJ48sQiRpzj90");
  });
});
