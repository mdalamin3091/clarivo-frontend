import { apiFetch } from '@/lib/api';
import type { OrgMember } from './types';

export async function getOrgMembers(orgId: string, init?: RequestInit): Promise<OrgMember[]> {
  return apiFetch<OrgMember[]>(`/api/v1/organizations/${orgId}/members`, init);
}
