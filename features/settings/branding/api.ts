import { apiFetch } from '@/lib/api';
import type { BrandingData, BrandingFormData } from './types';

export async function updateOrgBranding(data: BrandingFormData): Promise<BrandingData> {
  return apiFetch<BrandingData>('/api/v1/organizations/branding', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
