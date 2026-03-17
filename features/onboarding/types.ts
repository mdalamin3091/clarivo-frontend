export interface OnboardingData {
  modules: string[];
  accessibility: 'public' | 'private' | null;
  orgName: string;
  teamSize: string;
}
