'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useOnboardingStore } from '../store';
import { useSetupOrg } from '../hooks/useSetupOrg';
import { StepModules } from './StepModules';
import { StepAccessibility } from './StepAccessibility';
import { StepOrgName } from './StepOrgName';
import { StepTeamSize } from './StepTeamSize';
import { StepAuth } from './StepAuth';
import { Logo } from '@/shared/components/Logo';

const STEP_LABELS = ['Modules', 'Access', 'Workspace', 'Team', 'Account'];

export function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionPending } = useSession();

  const {
    step,
    modules,
    accessibility,
    orgName,
    teamSize,
    setStep,
    setModules,
    setAccessibility,
    setOrgName,
    setTeamSize,
    reset,
  } = useOnboardingStore();

  const isReturnFromOAuth = searchParams.get('complete') === '1';

  const setupOrgMutation = useSetupOrg({
    onSuccess: () => {
      reset();
      router.push('/dashboard');
    },
  });

  // After Google OAuth redirect, Zustand persist restores state from sessionStorage automatically
  useEffect(() => {
    if (isReturnFromOAuth && session) {
      setupOrgMutation.mutate({ modules, accessibility, orgName, teamSize });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReturnFromOAuth, session]);

  const totalSteps = session ? 4 : 5;

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return modules.length > 0;
      case 1:
        return accessibility !== null;
      case 2:
        return orgName.trim().length >= 2;
      case 3:
        return teamSize !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (session && step === totalSteps - 1) {
      setupOrgMutation.mutate({ modules, accessibility, orgName, teamSize });
      return;
    }
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  if (sessionPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (setupOrgMutation.isPending || isReturnFromOAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Setting up your workspace…
        </p>
        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
      </div>
    );
  }

  const isAuthStep = !session && step === 4;
  const isLastStep = step === totalSteps - 1;

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 via-white to-zinc-50 p-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {/* Progress indicator */}
          <div className="border-b border-zinc-100 px-8 py-5 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                      i < step
                        ? 'bg-indigo-600 text-white'
                        : i === step
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950'
                          : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
                    }`}
                  >
                    {i < step ? '✓' : i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`h-0.5 w-8 transition-all duration-500 sm:w-12 ${
                        i < step ? 'bg-indigo-600' : 'bg-zinc-200 dark:bg-zinc-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs font-medium text-zinc-400 dark:text-zinc-500">
              Step {step + 1} of {totalSteps} — {STEP_LABELS[step]}
            </p>
          </div>

          {/* Step content */}
          <div key={step} className="animate-step-in p-8">
            {step === 0 && <StepModules selected={modules} onChange={setModules} />}
            {step === 1 && <StepAccessibility value={accessibility} onChange={setAccessibility} />}
            {step === 2 && <StepOrgName value={orgName} onChange={setOrgName} />}
            {step === 3 && <StepTeamSize value={teamSize} onChange={setTeamSize} />}
            {step === 4 && !session && (
              <StepAuth
                onSuccess={() =>
                  setupOrgMutation.mutate({ modules, accessibility, orgName, teamSize })
                }
              />
            )}
          </div>

          {/* Navigation */}
          {!isAuthStep && (
            <div className="flex items-center justify-between border-t border-zinc-100 px-8 py-5 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 0}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 disabled:invisible dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              {setupOrgMutation.isError && (
                <p className="text-xs text-red-500">
                  {(setupOrgMutation.error as Error)?.message ?? 'Failed to create workspace'}
                </p>
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed() || setupOrgMutation.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {setupOrgMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isLastStep ? (
                  <>
                    {session ? 'Create workspace' : 'Continue'}
                    <Sparkles className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-600">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
