export type BaseQueryFilters = {
  /**
   * The index of the first record to be returned.
   */
  start?: number;

  /**
   * The amount of records to be returned.
   */
  limit?: number;
};

export type BaseTimeFilters = {
  /**
   * The start of the interval to filter the invoices. (Inclusive)
   * It should be a valid date string. Example: "2021-10-05 00:00:00"
   */
  after?: string;

  /**
   * The end of the interval to filter the invoices. (Non-inclusive)
   * It should be a valid date string. Example: "2021-10-05 00:00:00"
   */
  before?: string;
};
