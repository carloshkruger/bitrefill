import { HttpRequest } from "../../utils/http-request";
import { convertObjectToUrlQueryParams } from "../../utils/convertObjectToUrlQueryParams";
import type {
  CreateInvoice,
  CreateOptions,
  Invoice,
  ListInvoicesParams
} from "./types";
import { BitrefillError } from "../../utils/bitrefill-error";
import { sleep } from "../../utils/sleep";

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
  public async create(
    data: CreateInvoice,
    options: CreateOptions = {}
  ): Promise<Invoice> {
    const { onInvoiceCompleted } = options;
    const response = await this.request.post("/invoices", data);
    const invoice = response.data;

    if (onInvoiceCompleted) {
      this.waitForCompletion(invoice.id)
        .then(onInvoiceCompleted)
        .catch(console.error);
    }

    return invoice;
  }

  /**
   * Trigger the payment of an unpaid invoice.
   * Can only be used for invoices with "balance" payment method
   */
  public async pay(id: string): Promise<Invoice> {
    const response = await this.request.post(`/invoices/${id}/pay`, {});
    return response.data;
  }

  /**
   * Wait for the invoice to be completed
   */
  private async waitForCompletion(id: string): Promise<Invoice> {
    const maxRetries = 10;
    const timeoutMs = 11 * 60 * 1000;
    const maxDelayMs = 10 * 60 * 1000;
    const completedStatuses = [
      "all_delivered",
      "partial_delivery",
      "all_error"
    ];

    let delayMs = 15_000;
    let isCompleted = false;
    let currentRetry = 0;
    let invoice: Invoice;

    while (!isCompleted && currentRetry < maxRetries) {
      await sleep(delayMs);
      const response = await this.request.get(`/invoices/${id}`, {
        shouldWaitOnRateLimit: true,
        timeout: timeoutMs
      });
      invoice = response.data;
      isCompleted = completedStatuses.includes(invoice.status);
      currentRetry++;
      delayMs *= 2;
      if (delayMs > maxDelayMs) {
        delayMs = maxDelayMs;
      }
    }

    if (!isCompleted) {
      throw new BitrefillError(
        "Timeout reached waiting for the invoice completion."
      );
    }

    return invoice!;
  }
}
