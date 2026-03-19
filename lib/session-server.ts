import { cookies } from 'next/headers';

/**
 * Reads the current session from the backend auth API.
 * Server-only — never import this in Client Components.
 */
async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Returns the active organization ID from the server session.
 * Used by Server Component pages to scope prefetch queries.
 */
export async function getActiveOrgId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.session?.activeOrganizationId ?? null;
}

/**
 * Returns cookie headers suitable for authenticated server-side fetch calls.
 * Pass as `init` to feature api.ts functions when prefetching in Server Components.
 */
export async function getServerHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  return { cookie: cookieHeader };
}
