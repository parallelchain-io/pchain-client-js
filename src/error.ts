import { status400, status500 } from "./response_code";

export class ClientError {
  constructor(private error_code: number) {}

  response(): Error {
    switch (this.error_code) {
      case status400.INPUT_DECODE_FAILURE:
        return new Error("Input query parameter is not a pchain_types::Base64URL encoded string");
      case status400.INCORRECT_URL_AND_QUERY_PARAMS:
        return new Error("Incorrect url or query parameters");
      case status500.VIEW_SERVICE_CHANNEL_ERROR:
        return new Error("Internal Server Error. Server busy and failed to handle new request");
      case status500.VIEW_SERVICE_REQUEST_TIMEOUT:
        return new Error("Internal Server Error. Request Timeout");
      default:
        console.error(this.error_code);
        return new Error("Server Error Occurred");
    }
  }
}
