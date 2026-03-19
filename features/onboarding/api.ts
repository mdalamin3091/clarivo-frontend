import { apiFetch } from '@/lib/api';
import type { OnboardingData } from './types';

export async function checkOrgName(name: string): Promise<{ available: boolean }> {
  return apiFetch<{ available: boolean }>(
    `/api/v1/organizations/check-name?name=${encodeURIComponent(name)}`,
  );
}

export async function setupOrganization(
  data: Pick<OnboardingData, 'modules' | 'accessibility' | 'teamSize'> & { name: string },
): Promise<void> {
  await apiFetch('/api/v1/organizations/setup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
