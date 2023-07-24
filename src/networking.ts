import axios, { ResponseType } from "axios";

export class Networking {
  provider: string;

  constructor(provider: string) {
    this.provider = provider;
  }

  /**
   * @param request_url the complete url link for post request
   * @param data post data as rpc request
   * @returns rpc response data (always http status 200)
   */
  async post_request(request_url: string, data: any) {
    const response = await axios.post<Buffer>(`${request_url}`, data, {
      responseType: "arraybuffer",
    });
    return {
      status_code: response.status,
      message: response.statusText,
      data: response.data,
    };
  }

  /**
   * @param endpoint the rpc endpoint added on the base url
   * @param data post data as rpc request
   * @returns rpc response data (always http status 200)
   */
  async post_response(endpoint: string, data: any) {
    const request_url = `${this.provider}/${endpoint}`;
    const response = await this.post_request(request_url, data);
    if (response.status_code == 200) {
      // note, response.data previously was transformed to Buffer
      // to accomodate Axios returning ArrayBuffer object for arraybuffer responseType on browser
      // no longer needed from v5.0.0 as deserialize accepts both ArrayBuffer and Buffer
      return response.data;
    } else {
      throw Error(response.message);
    }
  }

  /**
   * @param request_url the complete url link for get request
   * @param responseType response type to be specified
   * @returns rpc response data (always http status 200)
   */
  async get_request(request_url: string, responseType: ResponseType) {
    const response = await axios.get(`${request_url}`, { responseType });
    return {
      status_code: response.status,
      message: response.statusText,
      data: response.data,
    };
  }

  /**
   * @param endpoint the rpc endpoint added on the base url
   * @param responseType response type to be specified
   * @returns rpc response data (always http status 200)
   */
  async get_response(endpoint: string, responseType: ResponseType) {
    const request_url = `${this.provider}/${endpoint}`;
    const response = await this.get_request(request_url, responseType);
    if (response.status_code == 200) {
      return response.data;
    } else {
      throw Error(response.message);
    }
  }

  /**
   * @returns ParallelChain RPC base network URL
   */
  getProvider(): string {
    return this.provider;
  }

  /**
   * assign new network provider for Client.
   * @param provider ParallelChain RPC base network URL
   */
  setProvider(provider: string) {
    this.provider = provider;
  }
}
