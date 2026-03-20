const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  // Don't set Content-Type for FormData — the browser sets it with the multipart boundary.
  const isFormData = options?.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...(isFormData ? {} : { headers: { 'Content-Type': 'application/json' } }),
    ...options,
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error((json as { message?: string }).message ?? `Request failed: ${res.status}`);
  }
  const json = await res.json();
  return (json.data ?? json) as T;
}
