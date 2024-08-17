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
    const response = await this.request.get(`/orders?${urlParams.toString()}`);
    return response.data;
  }

  /**
   * Retrieve an order by id.
   */
  public async retrieve(id: string): Promise<Order> {
    const response = await this.request.get(`/orders/${id}`);
    return response.data;
  }
}
