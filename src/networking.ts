type ResponseType =
  | "arraybuffer"
  | "blob"
  | "document"
  | "json"
  | "text"
  | "stream";

function handleResponse(response: Response, type: ResponseType) {
  if (type === "arraybuffer") {
    return response.arrayBuffer().then(Buffer.from);
  }
  if (type === "blob") {
    return response.blob();
  }
  if (type === "document") {
    return response.text();
  }
  if (type === "json") {
    return response.json();
  }
  if (type === "text") {
    return response.text();
  }
  if (type === "stream") {
    return response.body;
  }
  throw new Error(`unknown response type ${type}`);
}

export class Networking {
  provider: string;

  constructor(provider: string) {
    this.provider = provider;
  }

  /**
   * @param request_url the complete url link for post request
   * @param body post data as rpc request
   * @returns rpc response data (always http status 200)
   */
  async post_request(request_url: string, body: any) {
    const response = await fetch(request_url, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    const data = await handleResponse(response, "arraybuffer");
    return {
      status_code: response.status,
      message: response.statusText,
      data,
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
    const response = await fetch(`${request_url}`);
    const data = await handleResponse(response, responseType);
    return {
      status_code: response.status,
      message: response.statusText,
      data,
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
  getProvider = () => {
    return this.provider;
  };

  /**
   * assign new network provider for Client.
   * @param provider ParallelChain RPC base network URL
   */
  setProvider = (provider: string) => {
    this.provider = provider;
  };
}
