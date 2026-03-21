import { apiFetch } from '@/lib/api';
import type { WorkspaceFormData } from './types';

export async function updateOrg(orgId: string, data: WorkspaceFormData): Promise<void> {
  return apiFetch(`/api/v1/organizations/${orgId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteOrg(orgId: string): Promise<void> {
  return apiFetch(`/api/v1/organizations/${orgId}`, { method: 'DELETE' });
}
