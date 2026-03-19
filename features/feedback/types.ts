export type FeedbackStatus = 'in-review' | 'active' | 'closed' | 'done';

export interface FeedbackPost {
  id: string;
  title: string;
  description: string;
  status: FeedbackStatus;
  votes: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  authorId: string;
}
