import { createApiErrorFromResponse } from './errors';

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };
export async function apiClient<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
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
  // handle 204 No Content etc.
  if (response.status === 204) return undefined as T;
  return response.json();
}
// we will use this function later to display error notifications as we haven't yet implemented them in our app . 
 function handleApiError(error: unknown) {

}
