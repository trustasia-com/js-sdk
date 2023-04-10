import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { buildUserAgent } from "../version";

export interface Message {
  code: number;
  data?: any;
  error?: string;
}

export class HttpClient {
  axios: AxiosInstance;
  baseURL: string;
  userAgent: string;

  constructor(baseURL: string) {
    this.axios = Axios.create({
      withCredentials: true,
    });
    this.baseURL = baseURL;
    this.userAgent = buildUserAgent();
  }

  async request(req: AxiosRequestConfig) {
    req.baseURL = this.baseURL;
    if (!window) {
      if (req.headers) {
        req.headers["User-Agent"] = this.userAgent;
      } else {
        req.headers = { "User-Agent": this.userAgent };
      }
    }

    const { data } = await this.axios.request(req);
    if (data.code !== 0) {
      throw new Error(JSON.stringify(data));
    }
    return data.data;
  }

  newRequest(url: string, method: string, data?: any): AxiosRequestConfig {
    let result = data;
    if (typeof data === "object" && !(data instanceof ArrayBuffer)) {
      result = JSON.stringify(data);
    }
    return {
      url: `${this.baseURL}${url}`,
      baseURL: this.baseURL,
      method: method,
      data: result,
    };
  }
}
