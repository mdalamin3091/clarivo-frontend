'use client';

import { ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  step: number;
  isLastStep: boolean;
  isAuthenticated: boolean;
  canProceed: boolean;
  isPending: boolean;
  error: string | null;
  onBack: () => void;
  onNext: () => void;
}

export function OnboardingNav({
  step,
  isLastStep,
  isAuthenticated,
  canProceed,
  isPending,
  error,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="flex items-center justify-between border-t px-8 py-5">
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        disabled={step === 0}
        className={step === 0 ? 'invisible' : ''}
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <Button
        type="button"
        onClick={onNext}
        disabled={!canProceed || isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isLastStep ? (
          <>
            {isAuthenticated ? 'Create workspace' : 'Continue'}
            <Sparkles className="h-4 w-4" />
          </>
        ) : (
          <>
            Continue
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
