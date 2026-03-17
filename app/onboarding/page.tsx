'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { setupOrganization } from '@/lib/api';
import { StepModules } from './_components/StepModules';
import { StepAccessibility } from './_components/StepAccessibility';
import { StepOrgName } from './_components/StepOrgName';
import { StepTeamSize } from './_components/StepTeamSize';
import { StepAuth } from './_components/StepAuth';

interface OnboardingData {
  modules: string[];
  accessibility: 'public' | 'private' | null;
  orgName: string;
  teamSize: string;
}

const STEP_LABELS = ['Modules', 'Access', 'Workspace', 'Team', 'Account'];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionPending } = useSession();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    modules: [],
    accessibility: null,
    orgName: '',
    teamSize: '',
  });

  // After Google OAuth redirect back, complete=1 means auth is done
  const isReturnFromOAuth = searchParams.get('complete') === '1';

  // If authenticated and returning from OAuth, trigger org setup
  useEffect(() => {
    if (isReturnFromOAuth && session) {
      const saved = sessionStorage.getItem('onboarding-data');
      if (saved) {
        const parsed = JSON.parse(saved) as OnboardingData;
        setData(parsed);
        handleCreateOrg(parsed);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReturnFromOAuth, session]);

  const totalSteps = session ? 4 : 5; // Skip auth step if already logged in

  const createOrgMutation = useMutation({
    mutationFn: (d: OnboardingData) =>
      setupOrganization({
        name: d.orgName,
        modules: d.modules,
        accessibility: d.accessibility as 'public' | 'private',
        teamSize: d.teamSize,
      }),
    onSuccess: () => {
      sessionStorage.removeItem('onboarding-data');
      router.push('/dashboard');
    },
  });

  function handleCreateOrg(d: OnboardingData) {
    createOrgMutation.mutate(d);
  }

  // Save data to sessionStorage before OAuth redirect
  function saveAndProceed() {
    sessionStorage.setItem('onboarding-data', JSON.stringify(data));
  }

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return data.modules.length > 0;
      case 1: return data.accessibility !== null;
      case 2: return data.orgName.trim().length >= 2;
      case 3: return data.teamSize !== '';
      case 4: return true; // Auth step handles its own validation
      default: return false;
    }
  };

  const handleNext = () => {
    // If authenticated and on last non-auth step, create org directly
    if (session && step === totalSteps - 1) {
      handleCreateOrg(data);
      return;
    }
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (sessionPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (createOrgMutation.isPending || isReturnFromOAuth) {
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
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Clarivo
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {/* Progress */}
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
            {step === 0 && (
              <StepModules
                selected={data.modules}
                onChange={(modules) => setData((d) => ({ ...d, modules }))}
              />
            )}
            {step === 1 && (
              <StepAccessibility
                value={data.accessibility}
                onChange={(accessibility) => setData((d) => ({ ...d, accessibility }))}
              />
            )}
            {step === 2 && (
              <StepOrgName
                value={data.orgName}
                onChange={(orgName) => setData((d) => ({ ...d, orgName }))}
              />
            )}
            {step === 3 && (
              <StepTeamSize
                value={data.teamSize}
                onChange={(teamSize) => setData((d) => ({ ...d, teamSize }))}
              />
            )}
            {step === 4 && !session && (
              <StepAuth
                onBeforeGoogleRedirect={saveAndProceed}
                onSuccess={() => {
                  saveAndProceed();
                  handleCreateOrg(data);
                }}
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

              {createOrgMutation.isError && (
                <p className="text-xs text-red-500">
                  {(createOrgMutation.error as Error)?.message ?? 'Failed to create workspace'}
                </p>
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed() || createOrgMutation.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createOrgMutation.isPending ? (
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

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
