export type BitrefillProps = {
  apiId: string;
  apiSecret: string;
};

export class Bitrefill {
  constructor({ apiId, apiSecret }: BitrefillProps) {
    if (typeof apiId !== "string" || apiId.trim().length === 0) {
      throw new Error("Invalid or missing 'apiId' property.");
    }
    if (typeof apiSecret !== "string" || apiSecret.trim().length === 0) {
      throw new Error("Invalid or missing 'apiSecret' property.");
    }

    const authorizationHeader = Buffer.from(`${apiId}:${apiSecret}`).toString(
      "base64"
    );
  }
}
