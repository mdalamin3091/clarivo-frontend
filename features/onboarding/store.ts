import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { OnboardingData } from './types';

interface OnboardingState extends OnboardingData {
  step: number;
  setStep: (step: number) => void;
  setModules: (modules: string[]) => void;
  setAccessibility: (accessibility: 'public' | 'private') => void;
  setOrgName: (orgName: string) => void;
  setTeamSize: (teamSize: string) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  step: 0,
  modules: [] as string[],
  accessibility: null as 'public' | 'private' | null,
  orgName: '',
  teamSize: '',
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setStep: (step) => set({ step }),
      setModules: (modules) => set({ modules }),
      setAccessibility: (accessibility) => set({ accessibility }),
      setOrgName: (orgName) => set({ orgName }),
      setTeamSize: (teamSize) => set({ teamSize }),
      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'onboarding-data',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
