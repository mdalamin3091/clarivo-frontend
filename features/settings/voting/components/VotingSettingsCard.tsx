/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useActiveOrganization, authClient } from '@/lib/auth-client';
import { SwitchRow } from '@/shared/components/ui/SwitchRow';

type OrgUpdateData = Parameters<typeof authClient.organization.update>[0]['data'];

export function VotingSettingsCard() {
  const { data: org, isPending: isLoading, refetch } = useActiveOrganization();

  const [downVoting,               setDownVoting]               = useState(false);
  const [hideVotedCountUntilVoted, setHideVotedCountUntilVoted] = useState(false);

  useEffect(() => {
    if (!org) return;
    const extra = org as unknown as Record<string, unknown>;
    setDownVoting(              !!(extra.downVoting));
    setHideVotedCountUntilVoted(!!(extra.hideVotedCountUntilVoted));
  }, [org?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = async (field: string, value: boolean) => {
    const { error } = await authClient.organization.update({
      data: { [field]: value } as unknown as OrgUpdateData,
    });
    if (!error) void refetch();
  };

  const handleDownVoting = (checked: boolean) => {
    setDownVoting(checked);
    void update('downVoting', checked);
  };

  const handleHideVotedCount = (checked: boolean) => {
    setHideVotedCountUntilVoted(checked);
    void update('hideVotedCountUntilVoted', checked);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          <SwitchRow
            checked={downVoting}
            onChange={handleDownVoting}
            label="Enable down voting"
            description="Allow users to down-vote posts on your public portal."
          />
          <SwitchRow
            checked={hideVotedCountUntilVoted}
            onChange={handleHideVotedCount}
            label="Hide vote count until voted"
            description="Vote counts are hidden from users until they cast their own vote."
          />
        </div>
      )}
    </div>
  );
}
