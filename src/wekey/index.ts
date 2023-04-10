import { Session } from "../lib/credentials";
import {
  AuthRequestReq,
  AuthRequestResp,
  AuthResultReq,
  AuthResultResp,
  RegQRCodeReq,
  RegQRCodeResp,
  RegResultReq,
  RegResultResp,
} from "./types";
import { HttpClient, Message } from "../lib/client";

export class WeKeyClient {
  httpClient: HttpClient;
  session: Session;

  constructor(sess: Session, endpoint: string) {
    this.session = sess;
    this.httpClient = new HttpClient(endpoint);
  }

  async RegQRCode(req: RegQRCodeReq): Promise<Message> {
    if (!req.user_id) {
      throw new Error("Need specify user_id");
    }
    if (!req.username) {
      throw new Error("Need specify nickname");
    }

    const scope = "wekey/";
    const httpReq = this.httpClient.newRequest(
      "/ta-app/attestation/options",
      "POST",
      req
    );

    this.session.signRequest(httpReq, scope);

    const qrcode = await this.httpClient.request(httpReq);
    return { code: 0, data: qrcode as RegQRCodeResp };
  }

  async RegResult(req: RegResultReq, callback: Function): Promise<Message> {
    if (!req.msg_id) {
      throw new Error("Need specify msg_id");
    }

    const scope = "wekey/";
    const httpReq = this.httpClient.newRequest(
      `/ta-app/attestation/result/${req.msg_id.substring(1)}`,
      "GET"
    );

    this.session.signRequest(httpReq, scope);

    const result = await this.httpClient.request(httpReq);
    if (result.status === "success") {
      callback(result.user_id);
    }
    return { code: 0, data: result as RegResultResp };
  }

  async AuthRequest(req: AuthRequestReq): Promise<Message> {
    if (req.method != "qrcode" && req.method != "push") {
      throw new Error("Incorrect auth method: " + req.method);
    }
    if (req.user_id === "") {
      throw new Error("Need specify user_id");
    }

    const scope = "wekey/";
    const httpReq = this.httpClient.newRequest(
      "/ta-app/assertion/options",
      "POST",
      req
    );

    this.session.signRequest(httpReq, scope);

    const result = await this.httpClient.request(httpReq);
    return { code: 0, data: result as AuthRequestResp };
  }

  async AuthResult(req: AuthResultReq, callback: Function): Promise<Message> {
    if (!req.msg_id) {
      throw new Error("Need specify msg_id");
    }

    const scope = "wekey/";
    const httpReq = this.httpClient.newRequest(
      `/ta-app/assertion/result/${req.msg_id.substring(1)}`,
      "GET"
    );

    this.session.signRequest(httpReq, scope);

    const result = await this.httpClient.request(httpReq);
    if (result.status === "success") {
      callback(result.user_id);
    }
    return { code: 0, data: result as AuthResultResp };
  }
}
