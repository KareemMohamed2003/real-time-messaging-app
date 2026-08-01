/**
 *Optimized  Database base Error
 */
export class AppError {
  constructor(
    public message: string,
    public statusCode: number,
    public errorCode: string,
    public name: string,
  ) {}
}
/**
  Database-Specific NotFoundError .

   **/
export class NotFoundError extends AppError {
  constructor(resource: string, customMessage?: string) {
    super(
      customMessage ??  `${resource} not found`,
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
