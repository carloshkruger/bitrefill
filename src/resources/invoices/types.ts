import type { BaseQueryFilters, BaseTimeFilters } from "../../common/types";

export type PaymentMethod = "balance" | "bitcoin";
export type PaymentStatus = "unpaid" | "paid";

export type InvoiceStatus = "not_delivered" | "delivered" | "all_delivered";

export type CreateInvoiceProduct = {
  /**
   * Reference to the id of the product to be bought.
   */
  product_id: string;

  /**
   * Only one of these fields (value or package_id) needs to be provided and
   * it refers to either a value within the range of the product
   * or an id of a package from the packages list in the product.
   * Only one is required. For packages you can also provide the value field.
   * To note is that on packages, the value field can be a string.
   * Our API will support both values as a number and as a string.
   */
  value: number | string;

  /**
   * Amount of the same product to be bought. Optional and defaults to 1.
   */
  quantity?: number;

  /**
   * Check the value property
   */
  package_id?: string;

  /**
   * The phone number that is the target of the product, for example on phone refills.
   * This should be provided for products whose recipient_type is phone_number.
   * Optional when the product doesn't require it.
   */
  phone_number?: string;

  /**
   * The email of the end user to receive the product.
   * Optional and defaults to the API user email.
   */
  email?: string;

  /**
   * If we should send an email to email when the purchase is completed.
   * Optional and defaults to false.
   */
  send_email?: boolean;

  /**
   * If we should send an SMS to numbers when the purchase is completed.
   * Optional and defaults to false.
   */
  send_sms?: boolean;
};

type CreateBitcoinInvoice = {
  /**
   * The payment method for the invoice.
   */
  payment_method: "bitcoin";

  /**
   * Where we send the payment back to if there's any issue with an already paid for purchase.
   * Should be provided when paying with crypto currencies
   */
  refund_address: string;
};

type CreateBalanceInvoice = {
  /**
   * The payment method for the invoice.
   */
  payment_method: "balance";

  /**
   * If the invoice should be paid automatically. Optional and defaults to false.
   */
  auto_pay?: boolean;
};

export type CreateInvoice = (CreateBitcoinInvoice | CreateBalanceInvoice) & {
  /**
   * This is a list of the products to be bought.
   */
  products: CreateInvoiceProduct[];

  /**
   * A url that we should send the invoice to when it reaches the final stage.
   */
  webhook_url?: string;
};

export type Invoice = {
  id: string;
  created_time: string;
  completed_time: string;
  status: InvoiceStatus;
  user: {
    id: string;
    email: string;
  };
  payment: {
    method: PaymentMethod;
    address: string;
    currency: string;
    price: number;
    status: PaymentStatus;
    commission: number;
  };
  orders: {
    id: string;
    status: string;
    product: {
      id: string;
      name: string;
      value: string;
      currency: string;
      image: string;
      _href: string;
    };
    created_time: string;
    delivered_time: string;
  }[];
};

export type ListInvoicesParams = BaseQueryFilters & BaseTimeFilters;
