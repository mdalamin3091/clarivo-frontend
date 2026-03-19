'use client';

import { Users, UserPlus, Crown, Shield, User } from 'lucide-react';
import { useSession, useActiveOrganization } from '@/lib/auth-client';

const ROLE_BADGE: Record<string, { label: string; icon: typeof Crown; class: string }> = {
  owner:  { label: 'Owner',  icon: Crown,  class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400' },
  admin:  { label: 'Admin',  icon: Shield, class: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' },
  member: { label: 'Member', icon: User,   class: 'bg-muted text-muted-foreground' },
};

export function SettingsMembersPage() {
  const { data: session } = useSession();
  const { data: org }     = useActiveOrganization();

  const members = org?.members ?? [];

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
        {/* Table header */}
        <div className="grid grid-cols-[1fr_100px_80px] gap-4 border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <span>Member</span>
          <span>Role</span>
          <span />
        </div>

        {members.length > 0 ? (
          <ul>
            {members.map((m) => {
              const role   = (m.role ?? 'member') as keyof typeof ROLE_BADGE;
              const badge  = ROLE_BADGE[role] ?? ROLE_BADGE.member;
              const Icon   = badge.icon;
              const isMe   = m.userId === session?.user.id;
              const initial = m.user?.name?.charAt(0).toUpperCase() ?? '?';
              return (
                <li key={m.id} className="grid grid-cols-[1fr_100px_80px] items-center gap-4 border-b px-4 py-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {m.user?.name ?? 'Unknown'}
                        {isMe && <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.user?.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${badge.class}`}>
                    <Icon className="h-3 w-3" />
                    {badge.label}
                  </span>
                  <div className="flex justify-end">
                    {!isMe && (
                      <button className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                        Remove
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
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
