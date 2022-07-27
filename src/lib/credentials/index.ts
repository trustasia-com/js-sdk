import hmacSHA256 from "crypto-js/hmac-sha256";
import encHex from "crypto-js/enc-hex";
import { SignerDefault } from "./signer";
import { AxiosRequestConfig } from "axios";

// api host
const endpointTest = "https://api-test.wekey.com";
const endpointProd = "https://api.wekey.com";

interface Options {
  accessKey: string;
  secretKey: string;
  endpoint?: string;
  signerType?: number;
}

const DefaultOptions: Options = {
  accessKey: "",
  secretKey: "",
  endpoint: endpointProd,
  signerType: 0,
};

export class Session {
  options: Options;

  constructor(options: Options, isProd: boolean) {
    this.options = Object.assign({}, DefaultOptions, options);
    if (!this.options.accessKey || !this.options.secretKey) {
      throw new Error("sdk: accessKey or secretKey not specified");
    }
    if (this.options.endpoint == "") {
      if (isProd) {
        this.options.endpoint = endpointProd;
      } else {
        this.options.endpoint = endpointTest;
      }
    }
  }

  sumHMAC(data: string): string {
    return sumHMAC(data, this.options.secretKey);
  }

  signRequest(req: AxiosRequestConfig, scope: string) {
    return SignerDefault(
      req,
      this.options.accessKey,
      this.options.secretKey,
      scope
    );
  }
}

export function sumHMAC(data: string, secert: string): string {
  return encHex.stringify(hmacSHA256(data, secert));
}

