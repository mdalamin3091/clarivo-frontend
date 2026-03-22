import { apiFetch } from '@/lib/api';
import type { OnboardingData, CreatedOrganization } from './types';

export async function checkOrgSlug(slug: string): Promise<{ available: boolean }> {
  return apiFetch<{ available: boolean }>(
    `/api/v1/organizations/check-slug?slug=${encodeURIComponent(slug)}`,
  );
}

export async function setupOrganization(
  data: Pick<OnboardingData, 'modules' | 'accessibility' | 'teamSize'> & { name: string },
): Promise<CreatedOrganization> {
  return apiFetch<CreatedOrganization>('/api/v1/organizations/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
