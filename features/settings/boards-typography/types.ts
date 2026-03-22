export type BoardSorting = 'trending' | 'recent' | 'oldest' | 'top';
export type BoardVisibility = 'public' | 'private';

export interface BoardIcon {
  type: 'predefined' | 'emoji' | 'url';
  value: string;
}

export interface BoardGreeting {
  welcomingTitle:         string;
  welcomingDescription:   string;
  postCreationButtonText: string;
}

export interface Board {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  icon: BoardIcon;
  defaultSorting: BoardSorting;
  greeting: BoardGreeting | null;
  visibility: BoardVisibility;
  allowSubscribe: boolean;
  disableFollowupQuestions: boolean;
  disableEndUserPosting: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardInput {
  name: string;
  icon: { type: 'predefined' | 'emoji'; value: string };
  defaultSorting?: BoardSorting;
  greeting?: BoardGreeting | null;
  visibility?: BoardVisibility;
  allowSubscribe?: boolean;
  disableFollowupQuestions?: boolean;
  disableEndUserPosting?: boolean;
}

export interface UpdateBoardInput extends Partial<CreateBoardInput> {
  order?: number;
}

// ── Org-level board settings ──────────────────────────────────────────────────

export interface BoardGreeting {
  welcomingTitle:         string;
  welcomingDescription:   string;
  postCreationButtonText: string;
}
