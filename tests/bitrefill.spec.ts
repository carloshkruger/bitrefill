import { Bitrefill } from "../src/bitrefill";

describe("Bitrefill", () => {
  it("should thown an error if the apiKey is not provided", () => {
    expect(() => new Bitrefill({ apiId: "", apiSecret: "apiSecret" })).toThrow(
      new Error("Invalid or missing 'apiId' property.")
    );
  });

  it("should thown an error if the apiSecret is not provided", () => {
    expect(() => new Bitrefill({ apiId: "apiId", apiSecret: "" })).toThrow(
      new Error("Invalid or missing 'apiSecret' property.")
    );
  });

  it("should create the Bitrefill instance", () => {
    expect(
      () => new Bitrefill({ apiId: "apiId", apiSecret: "apiSecret" })
    ).not.toThrow();
  });
});
