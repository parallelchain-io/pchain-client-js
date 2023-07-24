import {
  BlockHashByHeightRequest,
  BlockHashByHeightResponse,
  BlockHeaderRequest,
  BlockHeaderResponse,
  BlockHeightByHashRequest,
  BlockHeightByHashResponse,
  BlockRequest,
  BlockResponse,
  DepositsRequest,
  DepositsResponse,
  HighestCommittedBlockResponse,
  PoolsRequest,
  PoolsResponse,
  ReceiptRequest,
  ReceiptResponse,
  StakesRequest,
  StakesResponse,
  StateRequest,
  StateResponse,
  SubmitTransactionRequest,
  SubmitTransactionResponse,
  TransactionPositionRequest,
  TransactionPositionResponse,
  TransactionRequest,
  TransactionResponse,
  ValidatorSetsRequest,
  ValidatorSetsResponse,
  ViewRequest,
  ViewResponse,
} from "pchain-types-js";
import { Networking } from "./networking";
import { Wallet } from "./wallet";
import { ClientError } from "./error";

/**
 * an API Client to interact with Parallelchain Mainnet
 */
export class Client {
  networking: Networking;
  wallet: Wallet;

  constructor(provider: string) {
    this.networking = new Networking(provider);
    // Create a wallet instance;
    this.wallet = new Wallet();
  }

  /**
   * @returns ParallelChain RPC base network URL
   */
  getProvider(): string {
    return this.networking.provider;
  }

  /**
   * assign new network provider for Client.
   * @param provider ParallelChain RPC base network URL
   */
  setProvider(provider: string) {
    this.networking.setProvider(provider);
  }

  /**
   * sends a GET request to the network provider to check if the current provider is up.
   * @returns true if the current provider is up.
   */
  async is_provider_up(): Promise<boolean> {
    try {
      await this.networking.get_response("", "text");
      return true;
    } catch {
      return false;
    }
  }

  /**
   * @param request SubmitTransactionRequest
   * @returns response from transaction submission.
   */
  async submit_transaction(request: SubmitTransactionRequest): Promise<SubmitTransactionResponse> {
    try {
      const response = await this.networking.post_response(
        "submit_transaction",
        request.serialize()
      );
      return SubmitTransactionResponse.deserialize(response) as SubmitTransactionResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request StateRequest
   * @returns account data in world state.
   */
  async state(request: StateRequest): Promise<StateResponse> {
    try {
      const response = await this.networking.post_response("state", request.serialize());
      return StateResponse.deserialize(response) as StateResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request ViewRequest
   * @returns result from execution of a contract view call.
   */
  async view(request: ViewRequest): Promise<ViewResponse> {
    try {
      const response = await this.networking.post_response("view", request.serialize());
      return ViewResponse.deserialize(response) as ViewResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request ValidatorSetsRequest
   * @returns previous / current / next validator sets with or without delegators included in result.
   */
  async validator_sets(request: ValidatorSetsRequest): Promise<ValidatorSetsResponse> {
    try {
      const response = await this.networking.post_response("validator_sets", request.serialize());
      return ValidatorSetsResponse.deserialize(response) as ValidatorSetsResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request PoolsRequest
   * @returns pools with a set of operator address, with or without stakes of each ppol
   */
  async pools(request: PoolsRequest): Promise<PoolsResponse> {
    try {
      const response = await this.networking.post_response("pools", request.serialize());
      return PoolsResponse.deserialize(response) as PoolsResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request StakesRequest
   * @returns stakes with a set of (operator address, owner address)
   */
  async stakes(request: StakesRequest): Promise<StakesResponse> {
    try {
      const response = await this.networking.post_response("stakes", request.serialize());
      return StakesResponse.deserialize(response) as StakesResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request DepositsRequest
   * @returns deposits with a set of (operator address, owner address)
   */
  async deposits(request: DepositsRequest): Promise<DepositsResponse> {
    try {
      const response = await this.networking.post_response("deposits", request.serialize());
      return DepositsResponse.deserialize(response) as DepositsResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request BlockRequest
   * @returns full block data starting from specified block hash.
   */
  async block(request: BlockRequest): Promise<BlockResponse> {
    try {
      const response = await this.networking.post_response("block", request.serialize());
      return BlockResponse.deserialize(response) as BlockResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request BlockHeadersRequest
   * @returns block headers starting from specified block hash.
   */
  async block_header(request: BlockHeaderRequest): Promise<BlockHeaderResponse> {
    try {
      const response = await this.networking.post_response("block_header", request.serialize());
      return BlockHeaderResponse.deserialize(response) as BlockHeaderResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request BlockHeightByHashRequest
   * @returns block height by specified block hash.
   */
  async block_height_by_hash(
    request: BlockHeightByHashRequest
  ): Promise<BlockHeightByHashResponse> {
    try {
      const response = await this.networking.post_response(
        "block_height_by_hash",
        request.serialize()
      );
      return BlockHeightByHashResponse.deserialize(response) as BlockHeightByHashResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request BlockHashByHeightRequest
   * @returns block hash by specified block height.
   */
  async block_hash_by_height(
    request: BlockHashByHeightRequest
  ): Promise<BlockHashByHeightResponse> {
    try {
      const response = await this.networking.post_response(
        "block_hash_by_height",
        request.serialize()
      );
      return BlockHashByHeightResponse.deserialize(response) as BlockHashByHeightResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @returns the latest block on ParallelChain.
   */
  async highest_committed_block(): Promise<HighestCommittedBlockResponse> {
    try {
      const response = await this.networking.get_response("highest_committed_block", "arraybuffer");
      return HighestCommittedBlockResponse.deserialize(response) as HighestCommittedBlockResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request TransactionRequest
   * @returns transaction by specified tx hash, include receipt or not.
   */
  async transaction(request: TransactionRequest): Promise<TransactionResponse> {
    try {
      const response = await this.networking.post_response("transaction", request.serialize());
      return TransactionResponse.deserialize(response) as TransactionResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request ReceiptRequest
   * @returns receipt with transaction, block hash and position by specified tx hash.
   */
  async receipt(request: ReceiptRequest): Promise<ReceiptResponse> {
    try {
      const response = await this.networking.post_response("receipt", request.serialize());
      return ReceiptResponse.deserialize(response) as ReceiptResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }

  /**
   * @param request TransactionPositionRequest
   * @returns transaction position in block by specified tx hash.
   */
  async transaction_position(
    request: TransactionPositionRequest
  ): Promise<TransactionPositionResponse> {
    try {
      const response = await this.networking.post_response(
        "transaction_position",
        request.serialize()
      );
      return TransactionPositionResponse.deserialize(response) as TransactionPositionResponse;
    } catch (e: any) {
      throw new ClientError(e).response();
    }
  }
}
