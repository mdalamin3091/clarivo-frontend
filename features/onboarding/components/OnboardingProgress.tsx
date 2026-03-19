'use client';

const STEP_LABELS = ['Modules', 'Access', 'Workspace', 'Team', 'Account'];

interface Props {
  step: number;
  totalSteps: number;
}

export function OnboardingProgress({ step, totalSteps }: Props) {
  return (
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
  );
}
