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
};

type ApiResponse = {
  meta: Record<string, any>;
  data: any;
  message?: string;
  error_code?: string;
};

const DEFAULT_BASE_URL = "https://api-bitrefill.com/v2";
const DEFAULT_USER_AGENT = `bitrefill-node:${packageVersion}`;

export class HttpRequest {
  private readonly headers: Headers;

  constructor({ authorizationHeader }: HttpRequestProps) {
    this.headers = {
      Authorization: authorizationHeader,
      "User-Agent": DEFAULT_USER_AGENT,
      "Content-Type": "application/json",
    };
  }

  private async fetchRequest(
    path: string,
    options: RequestInit
  ): Promise<ApiResponse> {
    try {
      const url = path.startsWith(DEFAULT_BASE_URL)
        ? path
        : `${DEFAULT_BASE_URL}${path}`;

      const response = await fetchRetry(url, options);
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

  async get(path: string): Promise<ApiResponse> {
    const requestOptions = {
      method: "GET",
      headers: this.headers,
    };

    return this.fetchRequest(path, requestOptions);
  }

  async post(path: string, body: Record<any, any>): Promise<ApiResponse> {
    const requestOptions = {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.fetchRequest(path, requestOptions);
  }
}
