export class ServerError extends Error {
  constructor() {
    super('Internal server eroor');
    this.name = 'ServerError';
  }
}
