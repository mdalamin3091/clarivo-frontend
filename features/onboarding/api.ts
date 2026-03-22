import { apiFetch } from '@/lib/api';
import type { OnboardingData, CreatedOrganization } from './types';

export async function setupOrganization(
  data: Pick<OnboardingData, 'modules' | 'accessibility' | 'teamSize'> & { name: string },
): Promise<CreatedOrganization> {
  return apiFetch<CreatedOrganization>('/api/v1/organizations/setup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
