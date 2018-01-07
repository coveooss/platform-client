export class PreconditionFailedException extends Error {
  constructor(public message: string) {
    super(message);
  }

  toString() {
    return this.message;
  }
}
