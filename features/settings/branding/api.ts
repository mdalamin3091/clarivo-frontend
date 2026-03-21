import { apiFetch } from '@/lib/api';
import type { BrandingData, BrandingFormData } from './types';

export async function updateOrgBranding(data: BrandingFormData): Promise<BrandingData> {
  return apiFetch<BrandingData>('/api/v1/organizations/branding', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
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
