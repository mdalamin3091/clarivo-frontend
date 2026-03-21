export interface BrandingData {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  displayName: string | null;
  brandColor: string | null;
  darkBgColor: string | null;
  defaultTheme: string | null;
  socialImage: string | null;
}

export interface BrandingFormData {
  displayName?: string;
  brandColor?: string | null;
  darkBgColor?: string | null;
  defaultTheme?: 'system' | 'light' | 'dark';
  socialImage?: string | null;
  logo?: string | null;
}
