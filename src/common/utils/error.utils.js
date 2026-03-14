export class ConflictException extends Error {
  constructor(message) {
    super(message, { cause: { status: 409 } });
  }
}
export class NotFoundException extends Error {
  constructor(message) {
    super(message, { cause: { status: 404 } });
  }
}
export class UnauthorizedException extends Error {
  constructor(message) {
    super(message, { cause: { status: 401 } });
  }
}
export class BadRequestException extends Error {
  constructor(message) {
    super(message, { cause: { status: 400 } });
  }
}
export class InvalidTokenException extends Error {
  constructor(message) {
    super(message, { cause: { status: 403 } });
  }
}
export class InvalidValidationException extends Error {
  constructor(message) {
    super(message, { cause: { status: 422 } });
  }
}
