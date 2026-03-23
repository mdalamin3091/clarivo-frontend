/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useActiveOrganization, authClient } from '@/lib/auth-client';
import { SwitchRow } from '@/shared/components/ui/SwitchRow';

type OrgUpdateData = Parameters<typeof authClient.organization.update>[0]['data'];

export function PrivacyCard() {
  const { data: org, isPending: isLoading, refetch } = useActiveOrganization();

  const [privateEta, setPrivateEta] = useState(false);

  useEffect(() => {
    if (!org) return;
    const extra = org as unknown as Record<string, unknown>;
    setPrivateEta(!!(extra.privateEta));
  }, [org?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = async (field: string, value: boolean) => {
    const { error } = await authClient.organization.update({
      data: { [field]: value } as unknown as OrgUpdateData,
    });
    if (!error) void refetch();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-1">
      <h3 className="text-sm font-semibold text-foreground mb-4">Privacy</h3>
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          <SwitchRow
            checked={privateEta}
            onChange={(checked) => { setPrivateEta(checked); void update('privateEta', checked); }}
            label="Private ETA"
            description="Hide estimated delivery dates from end users on your public portal."
          />
        </div>
      )}
    </div>
  );
}
