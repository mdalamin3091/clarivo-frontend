export interface OrgMember {
  id: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface WorkspaceFormData {
  name: string;
  slug: string;
}
