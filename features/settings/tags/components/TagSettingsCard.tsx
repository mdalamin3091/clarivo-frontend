'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useActiveOrganization, authClient } from '@/lib/auth-client';
import { SwitchRow } from '@/shared/components/ui/SwitchRow';

type OrgUpdateData = Parameters<typeof authClient.organization.update>[0]['data'];

export function TagSettingsCard() {
  const { data: org, isPending: isLoading, refetch } = useActiveOrganization();

  const [allowUserTagging, setAllowUserTagging] = useState(false);

  useEffect(() => {
    if (!org) return;
    const extra = org as unknown as Record<string, unknown>;
    setAllowUserTagging(!!(extra.allowUserToTaggingPosts));
  }, [org?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAllowUserTagging = async (checked: boolean) => {
    setAllowUserTagging(checked);
    const { error } = await authClient.organization.update({
      data: { allowUserToTaggingPosts: checked } as unknown as OrgUpdateData,
    });
    if (!error) void refetch();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">Tag settings</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Control how tags are used across your public portal.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <SwitchRow
          checked={allowUserTagging}
          onChange={(checked) => { void handleAllowUserTagging(checked); }}
          label="Allow users to tag posts"
          description="End users will be able to add tags to their feedback posts on the public portal."
        />
      )}
    </div>
  );
}
