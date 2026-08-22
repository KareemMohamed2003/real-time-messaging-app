/**
 *Optimized  Database base Error
 */
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly errorCode: string,
    public readonly name: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); //  important : Restores prototype chain  !!
  }
}
/**
  Database-Specific NotFoundError .
   **/
export class NotFoundError extends AppError {
  constructor(resource: string, customMessage?: string) {
    super(
      customMessage ?? `${resource} not found`,
      404,
      "RESOURCE_NOT_FOUND",
      "NotFoundError",
    );
  }
}

export class ConflictError extends AppError {
  constructor(resource: string, customMessage?: string) {
    console.log("conflict error");
    super(
      customMessage ?? `${resource} already exists`,
      409,
      "RESOURCE_CONFLICT",
      "ConflictError",
    );
  }
}

/**
    handles payload errors (missing data, invalid data required for database operations).
   **/
export class BadRequestError extends AppError {
  constructor(resource: string, customMessage?: string) {
    super(
      customMessage ?? `${resource} missing or invalid`,
      400,
      "BAD_REQUEST",
      "BadRequestError",
    );
  }
}

export class AuthorizationError extends AppError {
  constructor(resource: string, action: string, customMessage?: string) {
    super(
      customMessage ??
        `You do not have permission to ${action ?? "access"} ${resource}`,
      403,
      "FORBIDDEN",
      "AuthorizationError",
    );
  }
}

export class DatabaseError extends AppError {
  constructor() {
    super(
      "A database error occurred. Please try again.",
      500,
      "DATABASE_ERROR",
      "DatabaseError",
    );
  }
}
