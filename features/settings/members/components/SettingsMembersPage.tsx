'use client';

import { UserPlus, Users } from 'lucide-react';
import { useSession, useActiveOrganization } from '@/lib/auth-client';
import { MemberRow } from './MemberRow';

export function SettingsMembersPage() {
  const { data: session } = useSession();
  const { data: org }     = useActiveOrganization();
  const members           = org?.members ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Members</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage who has access to this workspace.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <UserPlus className="h-4 w-4" />
          Invite member
        </button>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="grid grid-cols-[1fr_100px_80px] gap-4 border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <span>Member</span>
          <span>Role</span>
          <span />
        </div>

        {members.length > 0 ? (
          <ul>
            {members.map((m) => (
              <MemberRow key={m.id} member={m} currentUserId={session?.user.id} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Users className="h-6 w-6 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">No members found</p>
          </div>
        )}
      </div>
    </div>
  );
}
