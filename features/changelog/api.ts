import { apiFetch } from '@/lib/api';
import type { ChangelogEntry } from './types';

export async function getChangelogs(orgId: string, init?: RequestInit): Promise<ChangelogEntry[]> {
  return apiFetch<ChangelogEntry[]>(`/api/v1/organizations/${orgId}/changelog`, init);
}

export async function createChangelog(
  orgId: string,
  data: Pick<ChangelogEntry, 'title' | 'content' | 'status'>,
): Promise<ChangelogEntry> {
  return apiFetch<ChangelogEntry>(`/api/v1/organizations/${orgId}/changelog`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
