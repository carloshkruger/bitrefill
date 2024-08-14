import { version as packageVersion } from "../../package.json";
import { BitrefillError } from "./bitrefill-error";

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
  message: string;
  error_code: string;
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

  private async fetchRequest(path: string, options = {}): Promise<any> {
    const response = await fetch(`${DEFAULT_BASE_URL}${path}`, options);
    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new BitrefillError(data.message, data.error_code);
    }

    return data.data;
  }

  async get(path: string) {
    const requestOptions = {
      method: "GET",
      headers: this.headers,
    };

    return this.fetchRequest(path, requestOptions);
  }

  async post(path: string, body: Record<any, any>) {
    const requestOptions = {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.fetchRequest(path, requestOptions);
  }
}
