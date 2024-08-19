import { HttpRequest } from "../../utils/http-request";
import { convertObjectToUrlQueryParams } from "../../utils/convertObjectToUrlQueryParams";
import type {
  ListProductsParams,
  ListProductsWithPaginationParams,
  Product
} from "./types";

export class Products {
  constructor(private readonly request: HttpRequest) {}

  /**
   * List the products with pagination.
   */
  public async list(
    params: ListProductsWithPaginationParams = {}
  ): Promise<Product[]> {
    const urlParams = convertObjectToUrlQueryParams(params);
    const response = await this.request.get(`/products?${urlParams}`);
    return response.data;
  }

  /**
   * List all products at once without the need of pagination
   */
  public async listAll(params: ListProductsParams = {}): Promise<Product[]> {
    const products: Product[] = [];
    const allParams = { ...params, start: 0, limit: 50 };
    const queryParamsWithoutPagination = convertObjectToUrlQueryParams(params);
    const initialQueryParams = convertObjectToUrlQueryParams(allParams);

    let endpoint: string | null = `/products?${initialQueryParams}`;

    while (endpoint) {
      const response = await this.request.get(endpoint);
      products.push(...response.data);

      endpoint = response.meta._next || null;

      if (endpoint) {
        endpoint = `${endpoint}&${queryParamsWithoutPagination}`;
      }
    }

    return products;
  }

  /**
   * Retrieve a specific product by its id.
   */
  public async retrieve(id: string): Promise<Product> {
    const response = await this.request.get(`/products/${id}`);
    return response.data;
  }
}
