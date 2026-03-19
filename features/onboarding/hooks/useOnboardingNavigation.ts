'use client';

import { useOnboardingStore } from '../store';

interface Options {
  isAuthenticated: boolean;
  orgNameAvailable: boolean;
  onSubmit: () => void;
}

/**
 * Owns all step navigation logic for the onboarding wizard.
 * Keeps OnboardingWizard as a pure rendering composer.
 */
export function useOnboardingNavigation({ isAuthenticated, orgNameAvailable, onSubmit }: Options) {
  const { step, modules, accessibility, setStep } = useOnboardingStore();

  const totalSteps = isAuthenticated ? 4 : 5;
  const isLastStep = step === totalSteps - 1;
  const isAuthStep = !isAuthenticated && step === 4;

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return modules.length > 0;
      case 1: return accessibility !== null;
      case 2: return orgNameAvailable;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    // >= so if step overflows (persisted step 4 but session now exists, totalSteps=4)
    // the "Create workspace" action still fires.
    if (isAuthenticated && step >= totalSteps - 1) {
      onSubmit();
      return;
    }
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return { step, totalSteps, isLastStep, isAuthStep, canProceed, handleNext, handleBack };
}
