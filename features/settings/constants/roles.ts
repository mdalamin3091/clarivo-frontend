import { Crown, Shield, User } from 'lucide-react';

/**
 * Static display config for org member roles.
 * Extracted here so it can be shared by MemberRow and any future role-aware UI.
 */
export const ROLE_BADGE: Record<
  string,
  { label: string; icon: typeof Crown; className: string }
> = {
  owner:  { label: 'Owner',  icon: Crown,  className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400' },
  admin:  { label: 'Admin',  icon: Shield, className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' },
  member: { label: 'Member', icon: User,   className: 'bg-muted text-muted-foreground' },
};
