import { HttpRequest } from "../../utils/http-request";
import { convertObjectToUrlQueryParams } from "../../utils/convertObjectToUrlQueryParams";
import type { CreateInvoice, Invoice, ListInvoicesParams } from "./types";

export class Invoices {
  constructor(private readonly request: HttpRequest) {}

  /**
   * List the invoices
   */
  public async list(params: ListInvoicesParams = {}): Promise<Invoice[]> {
    const urlParams = convertObjectToUrlQueryParams(params);
    const response = await this.request.get(
      `/invoices?${urlParams.toString()}`
    );
    return response.data;
  }

  /**
   * Retrieve a specific invoice by its id
   */
  public async retrieve(id: string): Promise<Invoice> {
    const response = await this.request.get(`/invoices/${id}`);
    return response.data;
  }

  /**
   * Create the invoice
   */
  public async create(data: CreateInvoice): Promise<Invoice> {
    const response = await this.request.post("/invoices", data);
    return response.data;
  }

  /**
   * Trigger the payment of an unpaid invoice.
   * Can only be used for invoices with "balance" payment method
   */
  public async pay(id: string): Promise<Invoice> {
    const response = await this.request.post(`/invoices/${id}/pay`, {});
    return response.data;
  }
}
