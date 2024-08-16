import { Bitrefill } from "../src/bitrefill";
import { CreateInvoice, Invoice } from "../src/resources/invoices/types";
import { BitrefillError } from "../src/utils/bitrefill-error";

describe("Invoices", () => {
  const bitrefill = new Bitrefill({
    apiId: "apiId",
    apiSecret: "apiSecret",
  });

  describe("list", () => {
    it("should list invoices", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      } as any);

      await expect(bitrefill.invoices.list()).resolves.toEqual([]);
    });

    it("should send the filters in the query params", async () => {
      const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      } as any);

      await expect(
        bitrefill.invoices.list({ limit: 10, start: 0, before: "2024-08-01" })
      ).resolves.toEqual([]);

      const fetchUrl = fetchSpy.mock.calls[0][0];
      expect(fetchUrl).toContain("limit=10");
      expect(fetchUrl).toContain("start=0");
      expect(fetchUrl).toContain("before=2024-08-01");
    });

    it("should thrown an error if the API returns an error", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          data: null,
          message: "Some error happened",
          error_code: "some_error_code",
        }),
      } as any);

      await expect(bitrefill.invoices.list()).rejects.toThrow(BitrefillError);
    });
  });

  describe("retrieve", () => {
    it("should retrieve an invoice", async () => {
      const invoice: Invoice = {
        id: "invoiceId",
        status: "delivered",
        completed_time: "",
        created_time: "",
        user: {
          id: "user_id",
          email: "email@test.com",
        },
        payment: {
          address: "address",
          commission: 1,
          currency: "USD",
          method: "balance",
          price: 10,
          status: "paid",
        },
        orders: [],
      };

      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: invoice }),
      } as any);

      await expect(bitrefill.invoices.retrieve(invoice.id)).resolves.toEqual(
        invoice
      );
    });
  });

  describe("create", () => {
    it("should create an invoice", async () => {
      const createInvoice: CreateInvoice = {
        payment_method: "balance",
        auto_pay: true,
        products: [
          {
            product_id: "product_1",
            value: 10,
          },
        ],
      };

      const invoice: Invoice = {
        id: "invoiceId",
        status: "delivered",
        completed_time: "",
        created_time: "",
        user: {
          id: "user_id",
          email: "email@test.com",
        },
        payment: {
          address: "address",
          commission: 1,
          currency: "USD",
          method: "balance",
          price: 10,
          status: "paid",
        },
        orders: [],
      };

      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: invoice }),
      } as any);

      await expect(bitrefill.invoices.create(createInvoice)).resolves.toEqual(
        invoice
      );
    });
  });

  describe("pay", () => {
    it("should pay an invoice", async () => {
      const invoice: Invoice = {
        id: "123",
        status: "delivered",
        completed_time: "",
        created_time: "",
        user: {
          id: "user_id",
          email: "email@test.com",
        },
        payment: {
          address: "address",
          commission: 1,
          currency: "USD",
          method: "balance",
          price: 10,
          status: "paid",
        },
        orders: [],
      };

      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: invoice }),
      } as any);

      await expect(bitrefill.invoices.pay(invoice.id)).resolves.toEqual(
        invoice
      );
    });
  });
});
