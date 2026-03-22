'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useActiveOrganization } from '@/lib/auth-client';
import { authClient } from '@/lib/auth-client';
import { SwitchRow } from '@/shared/components/ui/SwitchRow';

type OrgUpdateData = Parameters<typeof authClient.organization.update>[0]['data'];

export function StatusSettingsCard() {
  const { data: org, isPending: isLoading, refetch } = useActiveOrganization();

  const [hideCompleted, setHideCompleted] = useState(false);
  const [hideFromPublic, setHideFromPublic] = useState(false);

  // Sync local state from org data on load
  useEffect(() => {
    if (!org) return;
    const extra = org as unknown as Record<string, unknown>;
    setHideCompleted( !!(extra.hideCompletedAndCanceledStatuses));
    setHideFromPublic(!!(extra.hideAllStatusesFromPublicView));
  }, [org?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = async (field: string, value: boolean) => {
    const { error } = await authClient.organization.update({
      data: { [field]: value } as unknown as OrgUpdateData,
    });
    if (!error) void refetch();
  };

  const handleHideCompleted = (checked: boolean) => {
    setHideCompleted(checked);
    void update('hideCompletedAndCanceledStatuses', checked);
  };

  const handleHideFromPublic = (checked: boolean) => {
    setHideFromPublic(checked);
    void update('hideAllStatusesFromPublicView', checked);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">Status visibility settings</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Control how statuses are displayed across your public portal.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          <SwitchRow
            checked={hideCompleted}
            onChange={handleHideCompleted}
            label="Hide completed and rejected statuses"
            description="Posts marked as Completed or Rejected will not be visible to end users on your public portal."
          />
          <SwitchRow
            checked={hideFromPublic}
            onChange={handleHideFromPublic}
            label="Hide all statuses from public view"
            description="Status labels will only be visible to your team members. End users will not see any status information."
          />
        </div>
      )}
    </div>
  );
}
