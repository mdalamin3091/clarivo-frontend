export const queryKeys = {
  organizations: {
    checkName: (name: string) => ['organizations', 'check-name', name] as const,
  },
} as const;
