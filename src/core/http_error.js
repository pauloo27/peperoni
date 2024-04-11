export class HttpError extends Error {
  constructor(status, error, details) {
    super(error);
    this.status = status;
    this.error = error;
    this.details = details;
  }
}
