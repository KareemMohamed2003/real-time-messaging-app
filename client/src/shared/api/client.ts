import { createApiErrorFromResponse } from './errors';
type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

export const requestAborter = (timeout = 60000) => AbortSignal.timeout(timeout);
export async function apiClient<T>(
  url: string,
  options: RequestOptions = {},
  timeout?: number
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  let processedBody;
  if (options.body !== undefined) {
    processedBody = isFormData ? options.body : JSON.stringify(options.body);
  }
  const headers = {
    ...options.headers,
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  };
  const signals = [
    options.signal ?? undefined,
    timeout !== undefined ? AbortSignal.timeout(timeout) : undefined,
  ].filter((s): s is AbortSignal => !!s);
  const signal = signals.length > 1 ? AbortSignal.any(signals) : signals[0];
  const response = await fetch(url, {
    ...options,
    signal,
    credentials: 'include',
    headers: headers,
    body: processedBody as BodyInit,
  });

  if (!response.ok) {
    let body: { message: string; errorCode: string };
    try {
      body = await response.json();
    } catch {
      body = { message: response.statusText, errorCode: 'UNKNOWN_ERROR' }; // may need to change this later.
    }
    throw createApiErrorFromResponse(response.status, body);
  }
  // Empty body (204, or 200 with no content): resolve with null instead of throwing on JSON.parse.
  // check if response body is empty , prevents silent errors
  const responseText = await response.text();
  if (!responseText.trim()) return null as T;

  return JSON.parse(responseText);
}
// we will use this function later to display error notifications as we haven't yet implemented them in our app .
function handleApiError(error: unknown) {}
