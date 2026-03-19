import { apiFetch } from '@/lib/api';
import type { OrgMember, WorkspaceFormData } from './types';

export async function getOrgMembers(orgId: string, init?: RequestInit): Promise<OrgMember[]> {
  return apiFetch<OrgMember[]>(`/api/v1/organizations/${orgId}/members`, init);
}

export async function updateOrg(orgId: string, data: WorkspaceFormData): Promise<void> {
  return apiFetch(`/api/v1/organizations/${orgId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteOrg(orgId: string): Promise<void> {
  return apiFetch(`/api/v1/organizations/${orgId}`, { method: 'DELETE' });
}
