import { Bitrefill } from "../src/bitrefill";
import {
  AccountBalance,
  Commission,
  Provider,
} from "../src/resources/misc/types";

describe("Products", () => {
  const bitrefill = new Bitrefill({
    apiId: "apiId",
    apiSecret: "apiSecret",
  });

  describe("ping", () => {
    it("should ping", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: null }),
      } as any);

      await expect(bitrefill.misc.ping()).resolves.not.toThrow();
    });
  });

  describe("accountBalance", () => {
    it("should retrieve the account balance", async () => {
      const accountBalance: AccountBalance = {
        balance: 10,
        currency: "USD",
      };

      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: accountBalance,
        }),
      } as any);

      await expect(bitrefill.misc.accountBalance()).resolves.toEqual(
        accountBalance
      );
    });
  });

  describe("checkPhoneNumber", () => {
    const provider: Provider = {
      id: "provider_1",
      country_code: "55",
      country_name: "BR",
      created_time: "",
      currency: "BRL",
      image: "",
      in_stock: true,
      name: "Provider 1",
      packages: {
        id: "package_1",
        price: 1,
        value: "1",
      },
      range: {
        min: 1,
        max: 100,
        step: 10,
        price_rate: 1,
      },
      recipient_type: "",
    };

    it("should retrieve the providers", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: provider,
        }),
      } as any);

      await expect(
        bitrefill.misc.checkPhoneNumber({
          phone_number: "123456789",
        })
      ).resolves.toEqual(provider);
    });

    it("should send the filters in the query params", async () => {
      const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: provider }),
      } as any);

      await expect(
        bitrefill.misc.checkPhoneNumber({
          phone_number: "123456789",
          operator: "verizon",
        })
      ).resolves.toEqual(provider);

      const fetchUrl = fetchSpy.mock.calls[0][0];
      expect(fetchUrl).toContain("phone_number=123456789");
      expect(fetchUrl).toContain("operator=verizon");
    });
  });

  describe("commissions", () => {
    it("should retrieve the commissions", async () => {
      const commission: Commission = {
        id: "id",
        amount_eur: 100,
        amount_satoshi: 100000,
        amount_usd: 200,
        balance: 100,
        currency: "USD",
        date: "",
        order: {
          product: {
            id: "1",
            name: "Product 1",
            currency: "USD",
            title: "",
            value: 10,
          },
          price: 10,
          currency: "USD",
        },
      };

      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: commission,
        }),
      } as any);

      await expect(bitrefill.misc.commissions()).resolves.toEqual(commission);
    });
  });
});
