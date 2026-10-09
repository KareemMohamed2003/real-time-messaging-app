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

// distinguish error types . (server,network,form-validation,server-validation)
// an error handler is resposible for handling these errors
// check first if it's an api error  if not resolve it to a form error
// do we have to check in each mutation and each
