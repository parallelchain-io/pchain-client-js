export class ClientError{

    error_code: number;

    constructor( error_code:number ){
        this.error_code = error_code;
    }

    response = () => {
        switch(this.error_code){
            case response_code.status400.INPUT_DECODE_FAILURE: 
                return "Input query parameter is not a pchain_types::Base64URL encoded string."
            case response_code.status400.INCORRECT_URL_AND_QUERY_PARAMS:
                return "Incorrect url or query parameters."
            case response_code.status500.VIEW_SERVICE_CHANNEL_ERROR:
                return "Internal Server Error. Server busy and failed to handle new request."
            case response_code.status500.VIEW_SERVICE_REQUEST_TIMEOUT:
                return "Internal Server Error. Request Timeout" 
            default:
                return "Server Error Occurred"
        }
    }
}

export module response_code {
    export enum status400 {
        INPUT_DECODE_FAILURE = 0x44C,
        INCORRECT_URL_AND_QUERY_PARAMS = 0x44E,
    }
    
    export enum status500 {
        VIEW_SERVICE_CHANNEL_ERROR = 0x57D,
        VIEW_SERVICE_REQUEST_TIMEOUT = 0x57E,
    }
}
