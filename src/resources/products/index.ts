import { HttpRequest } from "../../utils/http-request";
import { convertObjectToUrlQueryParams } from "../../utils/convertObjectToUrlQueryParams";
import type {
  ListProductsParams,
  ListProductsWithPaginationParams,
  Product,
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
    return this.request.get(`/products?${urlParams}`);
  }

  /**
   * List all products at once without the need of pagination
   */
  public async listAll(params: ListProductsParams = {}): Promise<Product[]> {
    const products: Product[] = [];
    const allParams = { ...params, start: 0, limit: 50 };

    let hasMore = true;
    let start = 0;
    let limit = 50;

    while (hasMore) {
      allParams.start = start;
      allParams.limit = limit;

      const urlParams = convertObjectToUrlQueryParams(allParams);
      const response = await this.request.get(`/products?${urlParams}`);
      products.push(...response);

      if (response.length < limit) {
        hasMore = false;
      } else {
        start += limit;
      }
    }

    return products;
  }

  /**
   * Retrieve a specific product by its id.
   */
  public async retrieve(id: string): Promise<Product> {
    return this.request.get(`/products/${id}`);
  }
}
