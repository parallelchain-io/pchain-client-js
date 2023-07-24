# ParallelChain Mainnet Javascript Client Library

## Introduction

ParallelChain Mainnet Javascript Client Library (pchain-client-js) is a package providing a HTTP client for interacting with the [Parallelchain Mainnet Protocol](https://github.com/parallelchain-io/parallelchain-protocol) RPC API.

---

## Installation

The library is built with npm (8.x) and compatible to node (v16.x).
`pchain-client-js` is available as an npm package

```bash
// Using NPM
npm install pchain-client-js

// Yarn
yarn add pchain-client-js
```

## Importing

```javascript
// Lexical/ ESM/ TypeScript
import { Client } from "pchain-client-js";
// Non-lexical/ CommonJS
const Client = require("pchain-client-js").Client;
```

## Usage

```javascript
const client = new Client('https://pchain-test-rpc02.parallelchain.io');
const blockResponse: BlockResponse = client.block({
  block_hash,
})
console.log(blockResponse);
// Output
BlockResponse {
  block: Option {
    value: Block {
      blockHeader: ...,
      transactions: [...],
      receipts: [...]
    }
  }
}
```
