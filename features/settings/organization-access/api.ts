import { apiFetch } from '@/lib/api';
import type { AccessibilityFormData } from './types';

/**
 * Updates org accessibility via the existing branding PATCH endpoint.
 * Accessibility is part of the organization model and the branding schema
 * accepts it as an optional field — no separate endpoint needed.
 */
export async function updateOrgAccessibility(data: AccessibilityFormData): Promise<void> {
  await apiFetch('/api/v1/organizations/branding', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
