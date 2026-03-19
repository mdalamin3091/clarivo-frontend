export type ChangelogStatus = 'draft' | 'scheduled' | 'published';

export interface ChangelogEntry {
  id: string;
  title: string;
  content: string;
  status: ChangelogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}
