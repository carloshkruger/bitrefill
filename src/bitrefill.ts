import { Invoices } from "./resources/invoices";
import { Misc } from "./resources/misc";
import { Orders } from "./resources/orders";
import { Products } from "./resources/products";
import { HttpRequest } from "./utils/http-request";

const DEFAULT_TIMEOUT_IN_MS = 80_000;

export type BitrefillProps = {
  apiId: string;
  apiSecret: string;
  /**
   * Request timeout in milliseconds.
   * The default is 80000, 1 minute and 20 seconds
   */
  timeout?: number;
};

export class Bitrefill {
  public readonly products: Products;
  public readonly invoices: Invoices;
  public readonly orders: Orders;
  public readonly misc: Misc;

  constructor({
    apiId,
    apiSecret,
    timeout = DEFAULT_TIMEOUT_IN_MS
  }: BitrefillProps) {
    if (typeof apiId !== "string" || apiId.trim().length === 0) {
      throw new Error("Invalid or missing 'apiId' property.");
    }
    if (typeof apiSecret !== "string" || apiSecret.trim().length === 0) {
      throw new Error("Invalid or missing 'apiSecret' property.");
    }

    const authorizationHeader = Buffer.from(`${apiId}:${apiSecret}`).toString(
      "base64"
    );

    const httpRequest = new HttpRequest({ authorizationHeader, timeout });

    this.products = new Products(httpRequest);
    this.invoices = new Invoices(httpRequest);
    this.orders = new Orders(httpRequest);
    this.misc = new Misc(httpRequest);
  }
}
