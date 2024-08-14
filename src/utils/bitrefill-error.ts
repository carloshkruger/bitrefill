export class BitrefillError extends Error {
  public readonly errorCode: string;

  constructor(message: string, errorCode?: string) {
    super(message);
    this.name = BitrefillError.name;
    this.errorCode = errorCode || "";
  }
}
