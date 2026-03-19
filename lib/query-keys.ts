export const queryKeys = {
  organizations: {
    checkName: (name: string) => ['organizations', 'check-name', name] as const,
  },
  invitations: {
    get: (id: string) => ['invitations', id] as const,
  },
} as const;
