import { urlParse } from "https://deno.land/x/url_parse/mod.ts";
import {
  HttpServiceConfig,
  HttpServiceResponse,
} from "../models/interfaces.ts";
export default class HttpService {
  private uri: URL;
  private headers: Record<string, any> | undefined;
  constructor(config: HttpServiceConfig) {
    const { baseURL, headers } = config;
    this.uri = urlParse(baseURL);
    this.headers = headers;
  }

  private async processRequest<T = unknown>(
    path: string,
    headers: Record<string, any>,
    method: "GET" | "POST",
    data?: string
  ): Promise<HttpServiceResponse<T>> {
    const resp = await fetch(this.uri.toString() + path, {
      method,
      headers,
      body: data,
    });

    if (resp) {
      const data = await resp.json();
      return {
        protocol: this.uri.protocol,
        hostname: this.uri.hostname,
        path,
        method,
        headers: resp.headers,
        statusCode: resp.status,
        statusMessage: resp.statusText,
        data,
      };
    }

    throw new Error("No response.");
  }

  async get<T = unknown>(
    path: string,
    { headers }: HttpServiceConfig
  ): Promise<HttpServiceResponse<T>> {
    try {
      const result = await this.processRequest<T>(
        path,
        {
          ...this.headers,
          ...headers,
        },
        "GET"
      );

      return new Promise<HttpServiceResponse<T>>((resolve, reject) => {
        if (result.statusCode >= 200 && result.statusCode < 300)
          return resolve(result);
        reject(result);
      });
    } catch (error) {
      throw new Error(`"GET Request Error: " ${error}`);
    }
  }

  async post<T = unknown, K extends any = any>(
    path: string,
    payload: K,
    { headers }: HttpServiceConfig
  ): Promise<HttpServiceResponse<T>> {
    const data = JSON.stringify(payload);
    const result = await this.processRequest<T>(
      path,
      {
        "Content-Type": "application/json",
        "Content-Length": data.length,
        ...this.headers,
        ...headers,
      },
      "POST",
      data
    );

    return new Promise<HttpServiceResponse<T>>((resolve, reject) => {
      if (result.statusCode >= 200 && result.statusCode < 300)
        return resolve(result);
      reject(result);
    });
  }
}
