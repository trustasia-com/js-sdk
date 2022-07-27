import { Session } from "../lib/credentials";
import { CreateSubscribeReq, CreateSubscribeResp } from "./types";
import { HttpClient } from "../lib/client/client";

export class FinanceClient {
  httpClient: HttpClient;
  session: Session;

  constructor(sess: Session, cli: HttpClient) {
    this.session = sess;
    this.httpClient = cli;
  }

  async CreateSubscribe(req: CreateSubscribeReq): Promise<CreateSubscribeResp> {
    if (!req.user_id) {
      throw new Error("Need specify user_id");
    }
    if (!req.nickname) {
      throw new Error("Need specify nickname");
    }
    if (!req.product_id) {
      throw new Error("Need specify product_id");
    }

    // const data = JSON.stringify(req);
    const scope = "finance/";
    const httpReq = this.httpClient.newRequest(
      "/ta-finance/subscribe",
      "POST",
      req
    );

    this.session.signRequest(httpReq, scope);

    const resp = await this.httpClient.request(httpReq);
    return { subscribe_id: resp.subscribe_id || "" };
  }
}
