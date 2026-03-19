import { apiFetch } from '@/lib/api';
import type { Survey } from './types';

export async function getSurveys(orgId: string, init?: RequestInit): Promise<Survey[]> {
  return apiFetch<Survey[]>(`/api/v1/organizations/${orgId}/surveys`, init);
}

export async function createSurvey(
  orgId: string,
  data: Pick<Survey, 'title' | 'description'>,
): Promise<Survey> {
  return apiFetch<Survey>(`/api/v1/organizations/${orgId}/surveys`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
