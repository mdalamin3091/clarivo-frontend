const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error((json as { message?: string }).message ?? `Request failed: ${res.status}`);
  }
  const json = await res.json();
  return (json.data ?? json) as T;
}
