import { authClient } from '@/lib/auth-client';
import type { AccessibilityFormData } from './types';

// authClient.organization.update() data type only includes standard BA fields.
// accessibility is an additionalField — the cast bridges the typing gap.
type OrgUpdateData = Parameters<typeof authClient.organization.update>[0]['data'];

export async function updateOrgAccessibility(
  organizationId: string,
  data: AccessibilityFormData,
): Promise<void> {
  const { error } = await authClient.organization.update({
    data: data as unknown as OrgUpdateData,
    organizationId,
  });
  if (error) throw new Error(error.message);
}
