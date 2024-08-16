import { Bitrefill } from "../src/bitrefill";
import { Order } from "../src/resources/orders/types";

describe("Orders", () => {
  const bitrefill = new Bitrefill({
    apiId: "apiId",
    apiSecret: "apiSecret",
  });

  describe("list", () => {
    it("should list orders", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      } as any);

      await expect(bitrefill.orders.list()).resolves.toEqual([]);
    });

    it("should send the filters in the query params", async () => {
      const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      } as any);

      await expect(
        bitrefill.orders.list({ limit: 10, start: 0, before: "2024-08-01" })
      ).resolves.toEqual([]);

      const fetchUrl = fetchSpy.mock.calls[0][0];
      expect(fetchUrl).toContain("limit=10");
      expect(fetchUrl).toContain("start=0");
      expect(fetchUrl).toContain("before=2024-08-01");
    });
  });

  describe("retrieve", () => {
    it("should retrieve an order", async () => {
      const order: Order = {
        id: "order_id",
        commission: 1,
        created_time: "",
        delivered_time: "",
        invoice: {
          id: "invoice_id",
          _href: "",
        },
        product: {
          id: "product_id",
          _href: "",
          currency: "USD",
          image: "",
          name: "Product 1",
          value: "1",
        },
        status: "created",
        user: {
          id: "user_id",
          email: "user@email.com",
        },
        redemption_info: "",
      };

      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: order }),
      } as any);

      await expect(bitrefill.orders.retrieve(order.id)).resolves.toEqual(order);
    });
  });
});
