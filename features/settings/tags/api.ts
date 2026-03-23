import { apiFetch } from '@/lib/api';
import type { Tag, CreateTagInput, UpdateTagInput } from './types';

export async function fetchTags(): Promise<Tag[]> {
  const data = await apiFetch<{ tags: Tag[] }>('/api/v1/tags');
  return data.tags;
}

export async function createTag(input: CreateTagInput): Promise<Tag> {
  const data = await apiFetch<{ tag: Tag }>('/api/v1/tags', {
    method: 'POST',
    body:   JSON.stringify(input),
  });
  return data.tag;
}

export async function updateTag(id: string, input: UpdateTagInput): Promise<Tag> {
  const data = await apiFetch<{ tag: Tag }>(`/api/v1/tags/${id}`, {
    method: 'PATCH',
    body:   JSON.stringify(input),
  });
  return data.tag;
}

export async function deleteTag(id: string): Promise<void> {
  await apiFetch(`/api/v1/tags/${id}`, { method: 'DELETE' });
}
