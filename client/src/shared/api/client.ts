import { createApiErrorFromResponse } from './errors';

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };
export const requestAborter = () => {
  const controller = new AbortController();
  const timeout = 60000; // 1 min timeout
  setTimeout(() => {
    controller.abort();
  }, timeout);
  return controller.signal;
};

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
  const response = await fetch(url, {
    signal: timeout !== undefined ? AbortSignal.timeout(timeout) : undefined,
    ...options,
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

  // // check if response body is empty , prevents silent errors
  const responseText = await response.text();
  if (!responseText.trim()) return null as T;

  return JSON.parse(responseText)   ;

  // return  
}
// we will use this function later to display error notifications as we haven't yet implemented them in our app .
function handleApiError(error: unknown) {}
