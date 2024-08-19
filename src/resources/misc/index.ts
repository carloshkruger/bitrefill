import { HttpRequest } from "../../utils/http-request";
import { convertObjectToUrlQueryParams } from "../../utils/convertObjectToUrlQueryParams";
import type {
  AccountBalance,
  CheckPhoneNumberParams,
  Commission,
  Provider
} from "./types";

export class Misc {
  constructor(private readonly request: HttpRequest) {}

  /**
   * Ping server
   */
  public async ping(): Promise<string> {
    const response = await this.request.get("/ping");
    return response.message!;
  }

  /**
   * Retrieves the account balance
   */
  public async accountBalance(): Promise<AccountBalance> {
    const response = await this.request.get("/accounts/balance");
    return response.data;
  }

  /**
   * Search for providers for the specified phone number
   * There's some situations where we can't figure out
   * the operator of the phone number so we return
   * a list of possible ones instead of a single match.
   */
  public async checkPhoneNumber(
    params: CheckPhoneNumberParams
  ): Promise<Provider | Provider[]> {
    const urlParams = convertObjectToUrlQueryParams(params);
    const response = await this.request.get(`/check_phone_number?${urlParams}`);
    return response.data;
  }

  /**
   * List your commissions as an affiliate. (FOR AFFILIATES ONLY)
   */
  public async commissions(): Promise<Commission[]> {
    const response = await this.request.get("/commissions");
    return response.data;
  }
}
