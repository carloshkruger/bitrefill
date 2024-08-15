import { HttpRequest } from "../../utils/http-request";
import { convertObjectToUrlQueryParams } from "../../utils/convertObjectToUrlQueryParams";
import type { ListOrdersParams, Order } from "./types";

export class Orders {
  constructor(private readonly request: HttpRequest) {}

  /**
   * List the orders with pagination.
   */
  public async list(params: ListOrdersParams = {}): Promise<Order[]> {
    const urlParams = convertObjectToUrlQueryParams(params);
    return this.request.get(`/orders?${urlParams.toString()}`);
  }

  /**
   * Retrieve an order by id.
   */
  public async retrieve(id: string): Promise<Order> {
    return this.request.get(`/orders/${id}`);
  }
}
