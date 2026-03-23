/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useActiveOrganization, authClient } from '@/lib/auth-client';
import { SwitchRow } from '@/shared/components/ui/SwitchRow';

type OrgUpdateData = Parameters<typeof authClient.organization.update>[0]['data'];

export function GuestAccessCard() {
  const { data: org, isPending: isLoading, refetch } = useActiveOrganization();

  const [anonymousPosting,    setAnonymousPosting]    = useState(false);
  const [anonymousCommenting, setAnonymousCommenting] = useState(false);
  const [anonymousUpvoting,   setAnonymousUpvoting]   = useState(true);

  useEffect(() => {
    if (!org) return;
    const extra = org as unknown as Record<string, unknown>;
    setAnonymousPosting(   !!(extra.anonymousPosting));
    setAnonymousCommenting(!!(extra.anonymousCommenting));
    setAnonymousUpvoting(  extra.anonymousUpvoting !== false);
  }, [org?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = async (field: string, value: boolean) => {
    const { error } = await authClient.organization.update({
      data: { [field]: value } as unknown as OrgUpdateData,
    });
    if (!error) void refetch();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-1">
      <h3 className="text-sm font-semibold text-foreground mb-4">Guest access</h3>
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          <SwitchRow
            checked={anonymousPosting}
            onChange={(checked) => { setAnonymousPosting(checked); void update('anonymousPosting', checked); }}
            label="Anonymous posting"
            description="Allow guests to submit feedback posts without signing in."
          />
          <SwitchRow
            checked={anonymousCommenting}
            onChange={(checked) => { setAnonymousCommenting(checked); void update('anonymousCommenting', checked); }}
            label="Anonymous commenting"
            description="Allow guests to leave comments without signing in."
          />
          <SwitchRow
            checked={anonymousUpvoting}
            onChange={(checked) => { setAnonymousUpvoting(checked); void update('anonymousUpvoting', checked); }}
            label="Anonymous upvoting"
            description="Allow guests to upvote posts without signing in."
          />
        </div>
      )}
    </div>
  );
}
