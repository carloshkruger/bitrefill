export type CheckPhoneNumberParams = {
  /**
   * The phone number to be checked.
   */
  phone_number: string;

  /**
   * The phone's operator in case it's known. Ex: verizon
   */
  operator?: string;
};

export type AccountBalance = {
  balance: number;
  currency: string;
};

export type Commission = {
  id: string;
  amount_satoshi: number;
  amount_eur: number;
  amount_usd: number;
  currency: string;
  balance: number;
  order: {
    product: {
      id: string;
      name: string;
      title: string;
      value: number;
      currency: string;
    };
    price: number;
    currency: string;
  };
  date: string;
};

export type Provider = {
  id: string;
  name: string;
  country_code: string;
  country_name: string;
  currency: string;
  created_time: string;
  recipient_type: string;
  image: string;
  in_stock: boolean;
  packages: {
    id: string;
    value: string;
    price: number;
  };
  range: {
    min: number;
    max: number;
    step: number;
    price_rate: number;
  };
};
