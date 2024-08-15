import { Invoices } from "./resources/invoices";
import { Products } from "./resources/products";
import { HttpRequest } from "./utils/http-request";

export type BitrefillProps = {
  apiId: string;
  apiSecret: string;
};

export class Bitrefill {
  public readonly products: Products;
  public readonly invoices: Invoices;

  constructor({ apiId, apiSecret }: BitrefillProps) {
    if (typeof apiId !== "string" || apiId.trim().length === 0) {
      throw new Error("Invalid or missing 'apiId' property.");
    }
    if (typeof apiSecret !== "string" || apiSecret.trim().length === 0) {
      throw new Error("Invalid or missing 'apiSecret' property.");
    }

    const authorizationHeader = Buffer.from(`${apiId}:${apiSecret}`).toString(
      "base64"
    );

    const httpRequest = new HttpRequest({ authorizationHeader });

    this.products = new Products(httpRequest);
    this.invoices = new Invoices(httpRequest);
  }
}
