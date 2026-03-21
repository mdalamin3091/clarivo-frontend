

// ── Warning content per target value ──────────────────────────────────────────

import { OrgAccessibility } from "./types";

export const CONTENT: Record<OrgAccessibility, {
  title:       string;
  description: string;
  bullets:     { label: string; text: string }[];
  info:        string;
  confirmLabel: string;
}> = {
  public: {
    title:       'Change to public organization?',
    description: 'You are about to change your organization to public. Please review the following potential issues:',
    bullets: [
      {
        label: 'Anyone can access:',
        text:  'All content will be visible to anyone with the link, including non-authenticated users',
      },
      {
        label: 'Search engine indexing:',
        text:  'Your organization may appear in search results (can be configured separately)',
      },
      {
        label: 'Private content settings:',
        text:  'Individual posts, changelogs, and help articles marked as private will remain private',
      },
      {
        label: 'Access controls removed:',
        text:  'Email domain restrictions and invitation requirements will no longer apply',
      },
    ],
    info:         'Please review your content visibility settings to ensure sensitive information is not exposed before switching to public.',
    confirmLabel: 'Change privacy setting',
  },
  private: {
    title:       'Change to private organization?',
    description: 'You are about to change your organization to private. Please review the following potential issues:',
    bullets: [
      {
        label: 'Restricted access:',
        text:  'Only invited members can view your portal and submit feedback',
      },
      {
        label: 'Invitation required:',
        text:  'New users will need to be manually invited to gain access',
      },
      {
        label: 'Public links disabled:',
        text:  'Existing public share links will stop working for non-members',
      },
      {
        label: 'Widgets restricted:',
        text:  'Embedded feedback widgets will only be accessible to authenticated members',
      },
    ],
    info:         'Make sure all team members who need access are already invited before switching to private.',
    confirmLabel: 'Change privacy setting',
  },
};
