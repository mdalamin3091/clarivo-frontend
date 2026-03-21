import { apiFetch } from '@/lib/api';
import type { PortalMenuItem } from './types';

// publicPortalMenus is read via better-auth get-full-organization — no separate GET needed.
export async function updatePortalMenus(
  publicPortalMenus: PortalMenuItem[],
): Promise<{ publicPortalMenus: PortalMenuItem[] }> {
  return apiFetch('/api/v1/organizations/portal-menus', {
    method: 'PUT',
    body: JSON.stringify({ publicPortalMenus }),
  });
}
