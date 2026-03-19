'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/shared/components/Logo';
import { OrgCard } from './OrgCard';
import { useOrgList } from '../hooks/useOrgList';
import { useSelectOrg } from '../hooks/useSelectOrg';

export function OrgSelectPage() {
  const router = useRouter();
  const { data: orgs, isPending } = useOrgList();
  const { select, selectingId, error } = useSelectOrg();

  // No orgs → send to onboarding
  useEffect(() => {
    if (!isPending && orgs && orgs.length === 0) {
      router.replace('/onboarding');
    }
  }, [isPending, orgs, router]);

  if (isPending || (orgs && orgs.length === 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-primary/5 via-background to-muted/30 p-4">
      <div className="w-full max-w-md">

        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="rounded-2xl border bg-card shadow-xl">
          <div className="border-b px-8 py-6">
            <h1 className="text-xl font-semibold text-foreground">Choose a workspace</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Select an organization to continue, or create a new one.
            </p>
          </div>

          <div className="space-y-2 px-8 py-6">
            {orgs?.map((org) => (
              <OrgCard
                key={org.id}
                org={org}
                isSelecting={selectingId === org.id}
                onSelect={() => select(org.id)}
              />
            ))}

            {error && (
              <p className="animate-fade-in rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="border-t px-8 py-5">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl border-dashed text-sm font-medium"
              onClick={() => router.push('/onboarding')}
            >
              <Plus className="h-4 w-4" />
              Create new organization
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
