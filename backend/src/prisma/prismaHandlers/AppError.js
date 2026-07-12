export class PrismaError {
  constructor(message, statusCode, errorCode) {
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode
  }
}

export class NotFoundError extends PrismaError {
  constructor(resource, customMessage) {
    super(
      customMessage ? customMessage : `${resource} not found`,
      404,
      "RESOURCE_NOT_FOUND",
    );
  }
}

export class ConflictError extends PrismaError {
  constructor(resource, customMessage) {
    console.log("conflict error");
    super(
      customMessage
        ? customMessage
        : `${resource} already exists`,
      409,
      "RESOURCE_CONFLICT",
    );
  }
}

export class DatabaseError extends PrismaError {
  constructor() {
    super(
      "A database error occurred. Please try again.",
      500,
      "DATABASE_ERROR",
    );
  }
}
