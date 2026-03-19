export interface OnboardingData {
  modules: string[];
  accessibility: 'public' | 'private' | null;
  orgName: string;
  teamSize: string;
}

export interface CreatedOrganization {
  organization: {
    id: string;
    name: string;
    slug: string;
    modules: string[];
    accessibility: string;
    teamSize: string | null;
    createdAt: string;
  };
}
