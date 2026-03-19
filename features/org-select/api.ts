import { authClient } from '@/lib/auth-client';

export async function setActiveOrganization(orgId: string): Promise<void> {
  // .setActive() → POST /api/auth/organization/set-active (matches server endpoint)
  // .setActiveOrganization() would wrongly call /organization/set-active-organization
  const result = await authClient.organization.setActive({
    organizationId: orgId,
  });
  if (result.error) {
    throw new Error(result.error.message ?? 'Failed to select organization');
  }
}
