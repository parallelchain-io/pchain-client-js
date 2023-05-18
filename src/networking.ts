import axios, { ResponseType } from 'axios'

export class Networking {
    
    provider: string;

    constructor(provider:string){
        this.provider = provider;
    }

    /**
     * @param request_url the complete url link for post request
     * @param data post data as rpc request
     * @returns rpc response data (always http status 200)
     */
    post_request = async (request_url:string, data: any) => {
        try{
            const response  = await axios.post<Buffer>(`${request_url}`, data, { responseType: "arraybuffer" })
            return {status_code: response.status, message: response.statusText, data: response.data};
        } catch(e:any){
            throw Error(e);
        }
    }

    /**
     * @param endpoint the rpc endpoint added on the base url
     * @param data post data as rpc request
     * @returns rpc response data (always http status 200)
     */
    post_response = async (endpoint:string, data: any) => {
        try {
            const request_url = `${this.provider}/${endpoint}`;
            const response = await this.post_request(request_url, data);
            if (response.status_code == 200) {
                return Buffer.from(response.data);
            } else {
                throw Error(response.message)
            }
        } catch(e:any) {
            throw Error(e)
        }
    }

    /**
     * @param request_url the complete url link for get request
     * @param responseType response type to be specified
     * @returns rpc response data (always http status 200)
     */
    get_request = async (request_url:string, responseType: ResponseType) => {
        try{
            const response  = await axios.get(`${request_url}`, {responseType})
            return {status_code: response.status, message: response.statusText, data: response.data};
        } catch(e:any){
            throw Error(e);
        }
    }

    /**
     * @param endpoint the rpc endpoint added on the base url
     * @param responseType response type to be specified
     * @returns rpc response data (always http status 200)
     */
    get_response = async (endpoint:string, responseType: ResponseType) => {
        try {
            const request_url = `${this.provider}/${endpoint}`;
            const response = await this.get_request(request_url, responseType);
            if (response.status_code == 200) {
                return response.data
            } else {
                throw Error(response.message)
            }
        } catch(e:any) {
            throw Error(e);
        }
    }

    /**
     * @returns ParallelChain RPC base network URL
     */
    getProvider = () => {
        return this.provider;
    }

    /**
     * assign new network provider for Client.
     * @param provider ParallelChain RPC base network URL
     */
    setProvider = (provider:string) => {
        this.provider = provider;
    }
}