'use client';

import { useActiveOrganization } from '@/lib/auth-client';
import type { PortalMenuItem } from '../types';

/**
 * Reads publicPortalMenus from the active organization returned by
 * better-auth's get-full-organization. No separate API call needed.
 */
export function useOrgModules() {
  const { data: org, isPending } = useActiveOrganization();
  const extra = org as unknown as Record<string, unknown>;
  const data: PortalMenuItem[] = Array.isArray(extra?.publicPortalMenus)
    ? (extra.publicPortalMenus as PortalMenuItem[])
    : [];
  return { data: org ? data : undefined, orgId: org?.id, isLoading: isPending };
}
