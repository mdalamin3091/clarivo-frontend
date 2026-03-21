'use client';

import { ROLE_BADGE } from '../constants/roles';
import type { OrgMember } from '../types';

interface MemberRowProps {
  member: OrgMember;
  currentUserId: string | undefined;
}

export function MemberRow({ member, currentUserId }: MemberRowProps) {
  const role    = (member.role ?? 'member') as keyof typeof ROLE_BADGE;
  const badge   = ROLE_BADGE[role] ?? ROLE_BADGE.member;
  const Icon    = badge.icon;
  const isMe    = member.userId === currentUserId;
  const initial = member.user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <li className="grid grid-cols-[1fr_100px_80px] items-center gap-4 border-b px-4 py-3 last:border-0">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {initial}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {member.user?.name ?? 'Unknown'}
            {isMe && <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>}
          </p>
          <p className="text-xs text-muted-foreground">{member.user?.email}</p>
        </div>
      </div>

      <span className={`inline-flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${badge.className}`}>
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
}
