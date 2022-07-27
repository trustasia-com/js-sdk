import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class HttpClient {
  axios: AxiosInstance;
  baseURL: string;

  constructor(baseURL: string) {
    this.axios = Axios.create({
      withCredentials: true,
    });
    this.baseURL = baseURL;
  }

  async request(req: AxiosRequestConfig) {
    req.baseURL = this.baseURL;
    
    const { data } = await this.axios.request(req);
    if (data.code !== 0) {
      throw new Error(JSON.stringify(data));
    }
    return data.data;
  }
}

export function NewRequest(url: string, method: string): AxiosRequestConfig {
  return {
    url: url,
    method: method,
  };
}
