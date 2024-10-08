import { version as packageVersion } from "../../package.json";
import { BitrefillError } from "./bitrefill-error";
import { fetchRetry } from "./fetch-retry";

type Headers = {
  "User-Agent": string;
  "Content-Type": string;
  Authorization: string;
};

type HttpRequestProps = {
  authorizationHeader: string;
  timeout: number;
};

type ApiResponse = {
  meta: Record<string, any>;
  data: any;
  message?: string;
  error_code?: string;
};

type RequestConfig = {
  shouldWaitOnRateLimit?: boolean;
  timeout?: number;
};

const DEFAULT_BASE_URL = "https://api-bitrefill.com/v2";
const DEFAULT_USER_AGENT = `bitrefill-node:${packageVersion}`;

export class HttpRequest {
  private readonly timeout: number;
  private readonly headers: Headers;

  constructor({ authorizationHeader, timeout }: HttpRequestProps) {
    this.headers = {
      Authorization: authorizationHeader,
      "User-Agent": DEFAULT_USER_AGENT,
      "Content-Type": "application/json"
    };
    this.timeout = timeout;
  }

  private async fetchRequest(
    path: string,
    options: RequestInit,
    config: RequestConfig = {}
  ): Promise<ApiResponse> {
    try {
      const url = path.startsWith(DEFAULT_BASE_URL)
        ? path
        : `${DEFAULT_BASE_URL}${path}`;
      const timeout = config.timeout || this.timeout;

      const response = await fetchRetry(url, options, {
        timeout,
        shouldWaitOnRateLimit: config.shouldWaitOnRateLimit
      });
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new BitrefillError(
          data.message || "Internal server error",
          data.error_code
        );
      }

      return data;
    } catch (error: any) {
      if (error instanceof BitrefillError) {
        throw error;
      }

      throw new BitrefillError(
        `Error trying to make the HTTP request: ${error.message}`
      );
    }
  }

  async get(
    path: string,
    requestConfig: RequestConfig = {}
  ): Promise<ApiResponse> {
    const requestOptions = {
      method: "GET",
      headers: this.headers
    };

    return this.fetchRequest(path, requestOptions, requestConfig);
  }

  async post(path: string, body: Record<any, any>): Promise<ApiResponse> {
    const requestOptions = {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body)
    };

    return this.fetchRequest(path, requestOptions);
  }
}
