'use client';

import { BrandingForm } from './BrandingForm';

export function BrandingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Branding</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage the branding for your organization, including name, logo, and appearance settings.
        </p>
      </div>

      <BrandingForm />
    </div>
  );
}
