import type { BaseQueryFilters, BaseTimeFilters } from "../../common/types";

export type OrderStatus = "created";

export type RedemptionInfo = {
  code: string;
  link: string;
  pin: string;
  barcode_format: string;
  barcode_value: string;
  instructions: string;
  expiration_date: string;
  other: string;
  extra_fields: Record<string, any>;
};

export type Order = {
  id: string;
  status: OrderStatus;
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
  redemption_info: string | RedemptionInfo;
  commission: number;
  user: {
    id: string;
    email: string;
  };
  invoice: {
    id: string;
    _href: string;
  };
};

export type ListOrdersParams = BaseQueryFilters & BaseTimeFilters;
