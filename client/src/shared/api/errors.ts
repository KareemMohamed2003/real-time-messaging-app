
export class ApiError {
  constructor(
    public message: string,
    public statusCode: number,
    public errorCode: string
  ) {}
}

export function createApiErrorFromResponse(
  statusCode: number,
  body: { message: string; errorCode: string }
) {
  return new ApiError(body.message, statusCode, body.errorCode);
}





