import { apiFetch } from '@/lib/api';
import type { FeedbackPost, FeedbackDetail, CommentResponse } from './types';

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

export async function updateFeedbackPost(
  id: string,
  data: {
    title?:          string;
    description?:    string;
    boardId?:        string;
    statusId?:       string | null;
    tagIds?:         string[];
    assigneeIds?:    string[];
    eta?:            string | null;
    postVisibility?: 'public' | 'private';
    enableComment?:  boolean;
  },
): Promise<FeedbackPost> {
  return apiFetch<FeedbackPost>(`/api/v1/feedback/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteFeedbackPost(id: string): Promise<void> {
  await apiFetch(`/api/v1/feedback/${id}`, { method: 'DELETE' });
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

export async function getFeedbackDetail(id: string): Promise<FeedbackDetail> {
  const data = await apiFetch<{ feedback: FeedbackDetail }>(`/api/v1/feedback/${id}`);
  return data.feedback;
}

// ── Comment API ───────────────────────────────────────────────────────────────

export async function addComment(
  feedbackId: string,
  body: { content: unknown; parentId?: string },
): Promise<CommentResponse[]> {
  const data = await apiFetch<{ comments: CommentResponse[] }>(
    `/api/v1/feedback/${feedbackId}/comments`,
    { method: 'POST', body: JSON.stringify(body) },
  );
  return data.comments;
}

export async function updateComment(
  feedbackId: string,
  commentId:  string,
  body:       { content: unknown },
): Promise<CommentResponse[]> {
  const data = await apiFetch<{ comments: CommentResponse[] }>(
    `/api/v1/feedback/${feedbackId}/comments/${commentId}`,
    { method: 'PATCH', body: JSON.stringify(body) },
  );
  return data.comments;
}

export async function deleteComment(
  feedbackId: string,
  commentId:  string,
): Promise<CommentResponse[]> {
  const data = await apiFetch<{ comments: CommentResponse[] }>(
    `/api/v1/feedback/${feedbackId}/comments/${commentId}`,
    { method: 'DELETE' },
  );
  return data.comments;
}

export async function toggleCommentVote(
  feedbackId: string,
  commentId:  string,
  body:       { type: 'upvote' | 'downvote' },
): Promise<{ upvotes: number; downvotes: number; myVote: 'upvote' | 'downvote' | null }> {
  return apiFetch(
    `/api/v1/feedback/${feedbackId}/comments/${commentId}/vote`,
    { method: 'POST', body: JSON.stringify(body) },
  );
}
