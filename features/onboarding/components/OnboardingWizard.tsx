"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";
import { useOnboardingStore } from "../store";
import { useSetupOrg } from "../hooks/useSetupOrg";
import { useOnboardingNavigation } from "../hooks/useOnboardingNavigation";
import { OnboardingProgress } from "./OnboardingProgress";
import { OnboardingNav } from "./OnboardingNav";
import { StepModules } from "./StepModules";
import { StepAccessibility } from "./StepAccessibility";
import { StepOrgName } from "./StepOrgName";
import { StepTeamSize } from "./StepTeamSize";
import { StepAuth } from "./StepAuth";
import { Logo } from "@/shared/components/Logo";

export function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionPending } = useSession();

  const {
    modules,
    accessibility,
    orgName,
    teamSize,
    setModules,
    setAccessibility,
    setOrgName,
    setTeamSize,
    reset,
  } = useOnboardingStore();

  const [orgNameAvailable, setOrgNameAvailable] = useState(false);
  const isReturnFromOAuth = searchParams.get("complete") === "1";

  const setupOrgMutation = useSetupOrg({
    onSuccess: async (org) => {
      // Explicitly activate the newly created org so the session reflects it
      await authClient.organization.setActive({
        organizationId: org.organization.id,
      });
      reset();
      authClient.$store.notify("$listOrg");
      authClient.$store.notify("$activeOrgSignal");
      router.push("/dashboard");
    },
  });

  const triggerSetup = () =>
    setupOrgMutation.mutate({ modules, accessibility, orgName, teamSize });

  // After Google OAuth redirect, Zustand persist restores state from sessionStorage automatically
  useEffect(() => {
    if (isReturnFromOAuth && session) triggerSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReturnFromOAuth, session]);

  const {
    step,
    totalSteps,
    isLastStep,
    isAuthStep,
    canProceed,
    handleNext,
    handleBack,
  } = useOnboardingNavigation({
    isAuthenticated: !!session,
    orgNameAvailable,
    onSubmit: triggerSetup,
  });

  // ── Loading states ───────────────────────────────────────────────────────
  if (sessionPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const showSetupLoader =
    setupOrgMutation.isPending ||
    (isReturnFromOAuth && !setupOrgMutation.isError && !!session);

  if (showSetupLoader) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Setting up your workspace…
        </p>
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-primary/5 via-background to-muted/30 p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="rounded-2xl border bg-card shadow-xl">
          <OnboardingProgress step={step} totalSteps={totalSteps} />

          <div key={step} className="animate-step-in p-8">
            {step === 0 && (
              <StepModules selected={modules} onChange={setModules} />
            )}
            {step === 1 && (
              <StepAccessibility
                value={accessibility}
                onChange={setAccessibility}
              />
            )}
            {step === 2 && (
              <StepOrgName
                value={orgName}
                onChange={(name) => {
                  setOrgName(name);
                  setOrgNameAvailable(false);
                }}
                onAvailabilityChange={setOrgNameAvailable}
              />
            )}
            {step === 3 && (
              <StepTeamSize value={teamSize} onChange={setTeamSize} />
            )}
            {step === 4 && !session && <StepAuth onSuccess={triggerSetup} />}
          </div>

          {!isAuthStep && (
            <OnboardingNav
              step={step}
              isLastStep={isLastStep}
              isAuthenticated={!!session}
              canProceed={canProceed()}
              isPending={setupOrgMutation.isPending}
              error={
                setupOrgMutation.isError
                  ? ((setupOrgMutation.error as Error)?.message ??
                    "Failed to create workspace")
                  : null
              }
              onBack={handleBack}
              onNext={handleNext}
            />
          )}
        </div>
        {session ? null : (
          <>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/signin")}
                className="font-semibold text-primary hover:text-primary/80"
              >
                Sign in
              </button>
            </p>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
