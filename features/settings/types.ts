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

export interface BrandingData {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  brandColor: string | null;
  darkBgColor: string | null;
  defaultTheme: string | null;
  socialImage: string | null;
}

export interface BrandingFormData {
  name?: string;
  brandColor?: string | null;
  darkBgColor?: string | null;
  defaultTheme?: 'system' | 'light' | 'dark';
  socialImage?: string | null;
  logo?: string | null;
}
