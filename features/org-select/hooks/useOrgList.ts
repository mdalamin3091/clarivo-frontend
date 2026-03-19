'use client';

import { useListOrganizations } from '@/lib/auth-client';

/**
 * Returns the list of organizations the current user belongs to.
 * Thin wrapper over the better-auth hook so components never import auth-client directly.
 */
export function useOrgList() {
  return useListOrganizations();
}
