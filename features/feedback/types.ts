// ─── Shared summaries (mirror backend feedback.types.ts) ──────────────────────

export interface FeedbackAuthor {
  id:   string;
  role: string;
  user: { id: string; name: string; image: string | null };
}

export interface FeedbackStatusSummary {
  id:    string;
  name:  string;
  color: string;
}

export interface FeedbackTagSummary {
  id:    string;
  name:  string;
  color: string;
}

export interface FeedbackVotes {
  upvotes:   number;
  downvotes: number;
}

// ─── FeedbackPost — matches FeedbackListItem from the backend ─────────────────

export interface FeedbackPost {
  id:             string;
  organizationId: string;
  boardId:        string;
  authorId:       string;
  statusId:       string | null;
  title:          string;
  description:    unknown | null;
  postVisibility: 'public' | 'private';
  enableComment:  boolean;
  pinnedAt:       string | null;
  createdAt:      string;
  updatedAt:      string;
  author:         FeedbackAuthor;
  status:         FeedbackStatusSummary | null;
  tags:           FeedbackTagSummary[];
  assignees:      FeedbackAuthor[];
  votes:          FeedbackVotes;
  myVote:         'upvote' | 'downvote' | null;
  commentCount:   number;
}
