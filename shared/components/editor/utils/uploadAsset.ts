import { apiFetch } from '@/lib/api';

/**
 * Uploads an image file to the backend and returns the public URL.
 * Used by editor slash commands and the bottom toolbar.
 */
export async function uploadEditorImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const data = await apiFetch<{ url: string }>('/api/v1/upload/image', {
    method: 'POST',
    body: form,
  });
  return data.url;
}

/**
 * Uploads a generic file attachment and returns the public URL + original name.
 */
export async function uploadEditorFile(file: File): Promise<{ url: string; name: string }> {
  const form = new FormData();
  form.append('file', file);
  return apiFetch<{ url: string; name: string }>('/api/v1/upload/file', {
    method: 'POST',
    body: form,
  });
}
