# ParallelChain Mainnet Javascript Client Library (pchain_client_js)
---

This library wraps networked interactions with ParallelChain Mainnet RPC APIs.

Connection to a local or remote ParallelChain Mainnet node is required for most functionalities in this library.

## Installation

The library is built with npm (8.x) and compatible to node (v16.x). 
`pchain-types-js` is available as an npm package

```bash
// Using NPM
npm install pchain-client-js

// Yarn
yarn install pchain-client-js
```

## Usage

```javascript
// Lexical
import Client from 'pchain-client-js';
// Non-lexical
const Client = require('pchain-client-js');
// Connect to client
const client = new Client('http://localhost:40000');
console.log(client);
// Output
Client {
  getProvider: ...,
  setProvider: ...,
  ...
```

## Usage with TypeScript
```ts
  import Client from 'pchain-client-js';
  const client = new Client('http://localhost:40000');
```

If you are using the types in a commonjs module, like in a Node app, you just have to enable esModuleInterop and allowSyntheticDefaultImports in your tsconfig for typesystem compatibility:

```
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    ....
```