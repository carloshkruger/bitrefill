import { Bitrefill } from "../src/bitrefill";
import { Product } from "../src/resources/products/types";

describe("Products", () => {
  const bitrefill = new Bitrefill({
    apiId: "apiId",
    apiSecret: "apiSecret",
  });

  describe("list", () => {
    it("should list products", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      } as any);

      await expect(bitrefill.products.list()).resolves.toEqual([]);
    });

    it("should send the filters in the query params", async () => {
      const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      } as any);

      await expect(
        bitrefill.products.list({
          limit: 10,
          start: 0,
          include_test_products: true,
        })
      ).resolves.toEqual([]);

      const fetchUrl = fetchSpy.mock.calls[0][0];
      expect(fetchUrl).toContain("limit=10");
      expect(fetchUrl).toContain("start=0");
      expect(fetchUrl).toContain("include_test_products=true");
    });
  });

  describe("listAll", () => {
    it("should list all products, making more than one request if necessary", async () => {
      const PRODUCTS_PER_REQUEST = 50;
      const products: Product[] = [];

      // In this test we need to make 2 requests, so we need to add 1 more product
      for (let i = 0; i < PRODUCTS_PER_REQUEST + 1; i++) {
        products.push({
          id: i.toString(),
          name: `Product ${i}`,
          currency: "USD",
          country_code: "BR",
          country_name: "Brazil",
          created_time: "",
          image: "",
          in_stock: true,
          recipient_type: "",
          packages: {
            id: "package_id_1",
            price: 10,
            value: "10",
          },
          range: {
            min: 1,
            max: 100,
            step: 10,
            price_rate: 1,
          },
        });
      }

      // It will make 2 requests. The first one will return 50 products, and the second one will return 1 product
      const fetchSpy = jest
        .spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({
            data: products.slice(0, PRODUCTS_PER_REQUEST),
            meta: {
              _next: "endpoint.com/products?limit=50&start=50",
            },
          }),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({
            data: products.slice(PRODUCTS_PER_REQUEST),
            meta: { _next: null },
          }),
        } as any);

      await expect(
        bitrefill.products.listAll({ include_test_products: true })
      ).resolves.toEqual(products);

      const fetchUrl1 = fetchSpy.mock.calls[0][0];
      const fetchUrl2 = fetchSpy.mock.calls[1][0];

      expect(fetchSpy).toHaveBeenCalledTimes(2);
      expect(fetchUrl1).toContain("include_test_products=true");
      expect(fetchUrl2).toContain("include_test_products=true");
    });
  });

  describe("retrieve", () => {
    it("should retrieve a product", async () => {
      const product: Product = {
        id: "product_1",
        name: `Product 1`,
        currency: "USD",
        country_code: "BR",
        country_name: "Brazil",
        created_time: "",
        image: "",
        in_stock: true,
        recipient_type: "",
        packages: {
          id: "package_id_1",
          price: 10,
          value: "10",
        },
        range: {
          min: 1,
          max: 100,
          step: 10,
          price_rate: 1,
        },
      };

      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: product }),
      } as any);

      await expect(bitrefill.products.retrieve(product.id)).resolves.toEqual(
        product
      );
    });
  });
});
