'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { useSession, authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
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

  const [orgNameAvailable, setOrgNameAvailable] = useState(false);

  const isReturnFromOAuth = searchParams.get('complete') === '1';

  const setupOrgMutation = useSetupOrg({
    onSuccess: () => {
      reset();
      // Notify better-auth atoms so the org list and active org in the sidebar
      // update immediately when the dashboard mounts — no page refresh needed.
      authClient.$store.notify('$listOrg');
      authClient.$store.notify('$activeOrgSignal');
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
      case 0: return modules.length > 0;
      case 1: return accessibility !== null;
      case 2: return orgNameAvailable;
      case 3: return true; // team size is not required
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    // Use >= so that if step overflows (e.g. step 4 persisted but session now exists,
    // making totalSteps 4), the final "Create workspace" action still fires.
    if (session && step >= totalSteps - 1) {
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
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Show setup loader while mutation is in-flight, or while we returned from email
  // verification/OAuth and the session is present (waiting for the effect to fire the mutation).
  // Stop showing once the mutation errors — let the wizard surface the error message.
  // Also stop if session resolved to null (user not authenticated — show wizard to retry).
  const showSetupLoader =
    setupOrgMutation.isPending ||
    (isReturnFromOAuth && !setupOrgMutation.isError && !!session);

  if (showSetupLoader) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Setting up your workspace…</p>
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const isAuthStep = !session && step === 4;
  const isLastStep = step === totalSteps - 1;

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-primary/5 via-background to-muted/30 p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="rounded-2xl border bg-card shadow-xl">
          {/* Progress indicator */}
          <div className="border-b px-8 py-5">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                      i < step
                        ? 'bg-primary text-primary-foreground'
                        : i === step
                        
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i < step ? '✓' : i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`h-0.5 w-8 transition-all duration-500 sm:w-12 ${
                        i < step ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              Step {step + 1} of {totalSteps} — {STEP_LABELS[step]}
            </p>
          </div>

          {/* Step content */}
          <div key={step} className="animate-step-in p-8">
            {step === 0 && <StepModules selected={modules} onChange={setModules} />}
            {step === 1 && <StepAccessibility value={accessibility} onChange={setAccessibility} />}
            {step === 2 && (
              <StepOrgName
                value={orgName}
                onChange={(name) => { setOrgName(name); setOrgNameAvailable(false); }}
                onAvailabilityChange={setOrgNameAvailable}
              />
            )}
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
            <div className="flex items-center justify-between border-t px-8 py-5">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={step === 0}
                className={step === 0 ? 'invisible' : ''}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              {setupOrgMutation.isError && (
                <p className="text-xs text-destructive">
                  {(setupOrgMutation.error as Error)?.message ?? 'Failed to create workspace'}
                </p>
              )}

              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed() || setupOrgMutation.isPending}
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
              </Button>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/signin')}
            className="font-semibold text-primary hover:text-primary/80"
          >
            Sign in
          </button>
        </p>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
