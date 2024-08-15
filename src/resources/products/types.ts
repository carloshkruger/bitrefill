import { BaseQueryFilters } from "../../common/types";

export type ProductPackage = {
  id: string;
  value: string;
  price: number;
};

export type ProductRange = {
  min: number;
  max: number;
  step: number;
  price_rate: number;
};

export type Product = {
  id: string;
  name: string;
  country_code: string;
  country_name: string;
  currency: string;
  created_time: string;
  recipient_type: string;
  image: string;
  in_stock: boolean;
  packages: ProductPackage;
  range: ProductRange;
};

export type ListProductsParams = {
  /**
   * If the list should include test products (Default: false)
   */
  include_test_products?: boolean;
};

export type ListProductsWithPaginationParams = BaseQueryFilters &
  ListProductsParams;
