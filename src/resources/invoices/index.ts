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
    return this.request.get(`/invoices?${urlParams.toString()}`);
  }

  /**
   * Retrieve a specific invoice by its id
   */
  public async retrieve(id: string): Promise<Invoice> {
    return this.request.get(`/invoices/${id}`);
  }

  /**
   * Create the invoice
   */
  public async create(data: CreateInvoice): Promise<Invoice> {
    return this.request.post("/invoices", data);
  }

  /**
   * Trigger the payment of an unpaid invoice.
   * Can only be used for invoices with "balance" payment method
   */
  public async pay(id: string): Promise<Invoice> {
    return this.request.post(`/invoices/${id}/pay`, {});
  }
}
