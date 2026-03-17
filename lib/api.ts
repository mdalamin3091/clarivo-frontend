const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function checkOrgName(name: string): Promise<{ available: boolean }> {
  const res = await fetch(
    `${API_BASE}/api/v1/organizations/check-name?name=${encodeURIComponent(name)}`,
  );
  if (!res.ok) throw new Error('Failed to check name');
  const json = await res.json();
  return json.data;
}

export async function setupOrganization(data: {
  name: string;
  modules: string[];
  accessibility: 'public' | 'private';
  teamSize: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/organizations/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message || 'Failed to create organization');
  }
}
