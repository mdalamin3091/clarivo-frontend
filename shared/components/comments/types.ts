import type { JSONContent } from 'novel';

// Generic comment types — no feature-specific coupling

export interface CommentAuthor {
  id:    string;
  role?: string;
  user:  { id: string; name: string; image: string | null };
}

export interface CommentVoteState {
  upvotes:   number;
  downvotes: number;
}

export interface CommentData {
  id:        string;
  authorId:  string;
  parentId:  string | null;
  content:   unknown;
  isEdited:  boolean;
  createdAt: string;
  updatedAt: string;
  author:    CommentAuthor;
  votes:     CommentVoteState;
  myVote:    'upvote' | 'downvote' | null;
  replies:   CommentData[];
}

export interface CommentThreadProps {
  comments:        CommentData[];
  currentMemberId: string | null;
  isAdmin:         boolean;
  onAdd:           (content: JSONContent, parentId?: string) => void;
  onEdit:          (commentId: string, content: JSONContent) => void;
  onDelete:        (commentId: string) => void;
  onVote:          (commentId: string, type: 'upvote' | 'downvote') => void;
  isPendingAdd?:   boolean;
}
