/**
 * Central registry for all React Query cache keys.
 * Every feature reads keys from here — no inline key arrays anywhere else.
 */
export const queryKeys = {
  workspaces: {
    list: () => ['workspaces', 'list'] as const,
  },
  organizations: {
    checkName: (name: string) => ['organizations', 'check-name', name] as const,
    active:  (orgId: string) => ['organizations', orgId] as const,
    members: (orgId: string) => ['organizations', orgId, 'members'] as const,
  },
  feedback: {
    list:   (orgId: string)              => ['feedback', orgId, 'posts'] as const,
    detail: (orgId: string, id: string)  => ['feedback', orgId, 'posts', id] as const,
  },
  roadmap: {
    list:   (orgId: string)              => ['roadmap', orgId, 'items'] as const,
    detail: (orgId: string, id: string)  => ['roadmap', orgId, 'items', id] as const,
  },
  changelog: {
    list:   (orgId: string)              => ['changelog', orgId, 'entries'] as const,
    detail: (orgId: string, id: string)  => ['changelog', orgId, 'entries', id] as const,
  },
  surveys: {
    list:   (orgId: string)              => ['surveys', orgId] as const,
    detail: (orgId: string, id: string)  => ['surveys', orgId, id] as const,
  },
  boards: {
    list:   (orgId: string)             => ['boards', orgId] as const,
    detail: (orgId: string, id: string) => ['boards', orgId, id] as const,
  },
  invitations: {
    get: (id: string) => ['invitations', id] as const,
  },
} as const;
