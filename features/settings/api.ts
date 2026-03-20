import { apiFetch } from '@/lib/api';
import type { OrgMember, WorkspaceFormData, BrandingData, BrandingFormData, PortalMenuItem } from './types';

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

export async function updateOrgBranding(data: BrandingFormData): Promise<BrandingData> {
  return apiFetch<BrandingData>('/api/v1/organizations/branding', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// publicPortalMenus is read via better-auth get-full-organization — no separate GET needed.
export async function updatePortalMenus(
  publicPortalMenus: PortalMenuItem[],
): Promise<{ publicPortalMenus: PortalMenuItem[] }> {
  return apiFetch('/api/v1/organizations/portal-menus', {
    method: 'PUT',
    body: JSON.stringify({ publicPortalMenus }),
  });
}
