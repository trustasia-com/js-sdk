import { HttpClient } from "../lib/client";
import { RegQRCodeResp } from "./types";

export class WeKeyApp {
  httpClient: HttpClient;
  timerID: NodeJS.Timer;

  constructor(endpoint: string) {
    this.httpClient = new HttpClient(endpoint);
  }

  async RegQRCode(path: string): Promise<RegQRCodeResp> {
    const httpReq = this.httpClient.newRequest(path, "GET");
    return await this.httpClient.request(httpReq);
  }

  async RegResult(path: string) {
    const httpReq = this.httpClient.newRequest(path, "GET");
    return await this.httpClient.request(httpReq);
  }

  async AuthRequest(path: string): Promise<RegQRCodeResp> {
    const httpReq = this.httpClient.newRequest(path, "GET");
    return await this.httpClient.request(httpReq);
  }

  async AuthResult(path: string) {
    const httpReq = this.httpClient.newRequest(path, "GET");
    return await this.httpClient.request(httpReq);
  }
}
