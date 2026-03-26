import { apiFetch } from '@/lib/api';
import type { FeedbackPost } from './types';

interface BoardOption {
  id:   string;
  name: string;
  icon: { type: string; value: string } | null;
}

export async function getOrgBoards(): Promise<BoardOption[]> {
  const data = await apiFetch<{ boards: BoardOption[] }>('/api/v1/boards');
  return data.boards;
}

export async function getFeedbackPosts(_orgId: string, init?: RequestInit): Promise<FeedbackPost[]> {
  const data = await apiFetch<{ feedbacks: FeedbackPost[]; total: number; page: number; limit: number }>(
    '/api/v1/feedback',
    init,
  );
  return Array.isArray(data.feedbacks) ? data.feedbacks : [];
}

export async function createFeedbackPost(
  data: {
    boardId:     string;
    title:       string;
    description: string;
    statusId?:   string;
    tagIds?:     string[];
    assigneeIds?: string[];
  },
): Promise<FeedbackPost> {
  return apiFetch<FeedbackPost>('/api/v1/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
