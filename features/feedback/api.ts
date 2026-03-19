import { apiFetch } from '@/lib/api';
import type { FeedbackPost } from './types';

export async function getFeedbackPosts(orgId: string, init?: RequestInit): Promise<FeedbackPost[]> {
  return apiFetch<FeedbackPost[]>(`/api/v1/organizations/${orgId}/posts`, init);
}

export async function createFeedbackPost(
  orgId: string,
  data: Pick<FeedbackPost, 'title' | 'description'>,
): Promise<FeedbackPost> {
  return apiFetch<FeedbackPost>(`/api/v1/organizations/${orgId}/posts`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
