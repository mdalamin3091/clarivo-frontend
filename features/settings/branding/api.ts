import { authClient } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import type { BrandingFormData } from './types';

// authClient.organization.update() data type only includes standard BA fields
// (name, slug, logo, metadata). Custom additionalFields are passed at runtime;
// the cast bridges the gap until inferAdditionalFields cross-project typing is wired up.
type OrgUpdateData = Parameters<typeof authClient.organization.update>[0]['data'];

export async function updateOrgBranding(organizationId: string, data: BrandingFormData): Promise<void> {
  // Better Auth rejects null for string fields — strip nulls so omitted fields
  // are left unchanged rather than failing validation.
  const payload = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== null),
  );

  const { error } = await authClient.organization.update({
    data: payload as unknown as OrgUpdateData,
    organizationId,
  });
  if (error) throw new Error(error.message);
}

export async function uploadBrandingImage(
  file: File,
  type: 'logo' | 'social',
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch<{ url: string }>(`/api/v1/upload/image?type=${type}`, {
    method: 'POST',
    body: formData,
  });
}
