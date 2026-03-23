import { apiFetch } from '@/lib/api';
import type { CustomField, CreateCustomFieldInput, UpdateCustomFieldInput } from './types';

export async function fetchCustomFields(): Promise<CustomField[]> {
  const data = await apiFetch<{ fields: CustomField[] }>('/api/v1/custom-fields');
  return data.fields;
}

export async function createCustomField(input: CreateCustomFieldInput): Promise<CustomField> {
  const data = await apiFetch<{ field: CustomField }>('/api/v1/custom-fields', {
    method: 'POST',
    body:   JSON.stringify(input),
  });
  return data.field;
}

export async function updateCustomField(id: string, input: UpdateCustomFieldInput): Promise<CustomField> {
  const data = await apiFetch<{ field: CustomField }>(`/api/v1/custom-fields/${id}`, {
    method: 'PATCH',
    body:   JSON.stringify(input),
  });
  return data.field;
}

export async function deleteCustomField(id: string): Promise<void> {
  await apiFetch(`/api/v1/custom-fields/${id}`, { method: 'DELETE' });
}
