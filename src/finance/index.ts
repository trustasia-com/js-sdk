import { Session } from "../lib/credentials";
import {
  CallbackContent,
  CreateSubscribeReq,
  CreateSubscribeResp,
  FinanceCallbackReq,
} from "./types";
import { HttpClient } from "../lib/client/client";
import { Request } from "express";
import { stringify } from "qs";

export class FinanceClient {
  httpClient: HttpClient;
  session: Session;

  constructor(sess: Session, endpoint: string) {
    this.session = sess;
    this.httpClient = new HttpClient(endpoint);
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

    return await this.httpClient.request(httpReq);
  }

  FinanceCallback(req: Request): CallbackContent {
    const data = req.body as FinanceCallbackReq;

    const plaintext = stringify(
      {
        mch_id: data.mch_id,
        do: data.do,
        nonce: data.nonce,
        content: data.content,
      },
      {
        sort: (a, b) => {
          return a.localeCompare(b);
        },
      }
    );
    if (data.sign !== this.session.sumHMAC(plaintext)) {
      throw new Error("failed to validate signature");
    }
    const json = Buffer.from(data.content, "base64").toString();
    return JSON.parse(json) as CallbackContent;
  }
}
