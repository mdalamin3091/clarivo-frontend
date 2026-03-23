import { apiFetch } from '@/lib/api';
import type { Status, CreateStatusInput, UpdateStatusInput } from './types';

export async function fetchStatuses(): Promise<Status[]> {
  const data = await apiFetch<{ statuses: Status[] }>('/api/v1/statuses');
  return data.statuses;
}

export async function createStatus(input: CreateStatusInput): Promise<Status> {
  const data = await apiFetch<{ status: Status }>('/api/v1/statuses', {
    method: 'POST',
    body:   JSON.stringify(input),
  });
  return data.status;
}

export async function updateStatus(id: string, input: UpdateStatusInput): Promise<Status> {
  const data = await apiFetch<{ status: Status }>(`/api/v1/statuses/${id}`, {
    method: 'PATCH',
    body:   JSON.stringify(input),
  });
  return data.status;
}

export async function deleteStatus(id: string): Promise<void> {
  await apiFetch(`/api/v1/statuses/${id}`, { method: 'DELETE' });
}

export async function setDefaultStatus(id: string): Promise<Status> {
  const data = await apiFetch<{ status: Status }>(`/api/v1/statuses/${id}/default`, {
    method: 'PATCH',
  });
  return data.status;
}
