import {
  LayoutDashboard,
  MessageSquare,
  Map,
  Newspaper,
  ClipboardList,
  Bell,
  BarChart2,
  Settings,
  MessageCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const MODULE_ICONS = [
  { label: 'Dashboard', href: '/dashboard',           icon: LayoutDashboard, exact: true },
  { label: 'Feedback',  href: '/dashboard/feedback',  icon: MessageSquare },
  { label: 'Roadmap',   href: '/dashboard/roadmap',   icon: Map },
  { label: 'Changelog', href: '/dashboard/changelog', icon: Newspaper },
  { label: 'Surveys',   href: '/dashboard/surveys',   icon: ClipboardList },
];
  
export const BOTTOM_ICONS = [
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Analytics',     href: '/dashboard/analytics',     icon: BarChart2 },
  { label: 'Settings',      href: '/dashboard/settings',      icon: Settings },
];

// ── Section types ──────────────────────────────────────────────────────────────

export type PanelItem = { label: string; href: string; color?: string };

/** Flat list section (existing) */
export type FlatPanelSection = {
  kind:  'flat';
  title: string;
  items: PanelItem[];
};

export type ModuleGroupItem = { label: string; href: string };
export type ModuleGroup = {
  label:       string;
  icon:        LucideIcon;
  items:       ModuleGroupItem[];
  defaultOpen?: boolean;
};

/** Collapsible module-group section */
export type ModulePanelSection = {
  kind:   'modules';
  title:  string;
  groups: ModuleGroup[];
};

export type AnyPanelSection = FlatPanelSection | ModulePanelSection;

/** Back-compat alias — callers that don't need groups can still use PanelSection */
export type PanelSection = FlatPanelSection;

export type PanelConfig = { heading: string; sections: AnyPanelSection[] };

// ── Panel configs ──────────────────────────────────────────────────────────────

export const PANEL_CONFIG: Record<string, PanelConfig> = {
  '/dashboard/feedback': {
    heading: 'Feedback',
    sections: [
      {
        kind:  'flat',
        title: 'Status',
        items: [
          { label: 'In Review', href: '/dashboard/feedback?status=in-review', color: 'bg-yellow-400' },
          { label: 'Active',    href: '/dashboard/feedback?status=active',    color: 'bg-green-400'  },
          { label: 'Closed',    href: '/dashboard/feedback?status=closed',    color: 'bg-red-400'    },
          { label: 'Done',      href: '/dashboard/feedback?status=done',      color: 'bg-blue-400'   },
        ],
      },
      {
        kind:  'flat',
        title: 'Views',
        items: [
          { label: 'All Posts', href: '/dashboard/feedback' },
        ],
      },
    ],
  },
  '/dashboard/roadmap': {
    heading: 'Roadmap',
    sections: [
      {
        kind:  'flat',
        title: 'Status',
        items: [
          { label: 'Planned',     href: '/dashboard/roadmap?status=planned',     color: 'bg-slate-400' },
          { label: 'In Progress', href: '/dashboard/roadmap?status=in-progress', color: 'bg-blue-400'  },
          { label: 'Completed',   href: '/dashboard/roadmap?status=completed',   color: 'bg-green-400' },
        ],
      },
      {
        kind:  'flat',
        title: 'Views',
        items: [
          { label: 'Board',    href: '/dashboard/roadmap' },
          { label: 'Timeline', href: '/dashboard/roadmap/timeline' },
          { label: 'List',     href: '/dashboard/roadmap/list' },
        ],
      },
    ],
  },
  '/dashboard/changelog': {
    heading: 'Changelog',
    sections: [
      {
        kind:  'flat',
        title: 'Status',
        items: [
          { label: 'Published', href: '/dashboard/changelog?status=published', color: 'bg-green-400'  },
          { label: 'Draft',     href: '/dashboard/changelog?status=draft',     color: 'bg-slate-400'  },
          { label: 'Scheduled', href: '/dashboard/changelog?status=scheduled', color: 'bg-yellow-400' },
        ],
      },
    ],
  },
  '/dashboard/surveys': {
    heading: 'Surveys',
    sections: [
      {
        kind:  'flat',
        title: 'Status',
        items: [
          { label: 'Active', href: '/dashboard/surveys?status=active', color: 'bg-green-400' },
          { label: 'Draft',  href: '/dashboard/surveys?status=draft',  color: 'bg-slate-400' },
          { label: 'Closed', href: '/dashboard/surveys?status=closed', color: 'bg-red-400'   },
        ],
      },
    ],
  },
  '/dashboard/settings': {
    heading: 'Settings',
    sections: [
      {
        kind:  'flat',
        title: 'General',
        items: [
          { label: 'Workspace', href: '/dashboard/settings' },
          { label: 'Members',   href: '/dashboard/settings/members' },
          { label: 'Billing',   href: '/dashboard/settings/billing' },
        ],
      },
      {
        kind:  'flat',
        title: 'Branding & Customization',
        items: [
          { label: 'Branding',      href: '/dashboard/settings/branding' },
          { label: 'Setup Modules', href: '/dashboard/settings/setup-modules' },
        ],
      },
      {
        kind:  'flat',
        title: 'Access & Authentication',
        items: [
          { label: 'Organization Access', href: '/dashboard/settings/organization-access' },
        ],
      },
      {
        kind:   'modules',
        title:  'Modules',
        groups: [
          {
            label:       'Support',
            icon:        MessageCircle,
            defaultOpen: false,
            items: [
              { label: 'General',            href: '/dashboard/settings/modules/support/general' },
              { label: 'Notifications',      href: '/dashboard/settings/modules/support/notifications' },
            ],
          },
          {
            label:       'Feedback & Roadmap',
            icon:        MessageSquare,
            defaultOpen: false,
            items: [
              { label: 'Boards & Typography', href: '/dashboard/settings/boards' },
              { label: 'Roadmap',             href: '/dashboard/settings/roadmap' },
              { label: 'Statuses',            href: '/dashboard/settings/statuses' },
              { label: 'Tags',                href: '/dashboard/settings/tags' },
              { label: 'Voting',              href: '/dashboard/settings/voting' },
              { label: 'Custom Fields',       href: '/dashboard/settings/custom-fields' },
              { label: 'Access & Privacy',    href: '/dashboard/settings/access' },
              { label: 'Prioritization',      href: '/dashboard/settings/prioritization' },
              { label: 'Macros',              href: '/dashboard/settings/macros' },
              { label: 'Import / Export',     href: '/dashboard/settings/import-export' },
              { label: 'Notifications',       href: '/dashboard/settings/notifications' },
            ],
          },
        ],
      },
      {
        kind:  'flat',
        title: 'Integrations',
        items: [
          { label: 'API Keys',  href: '/dashboard/settings/api-keys' },
          { label: 'Webhooks',  href: '/dashboard/settings/webhooks' },
        ],
      },
    ],
  },
};

export const PANEL_ROUTES = Object.keys(PANEL_CONFIG);

export function getPanel(pathname: string): PanelConfig | null {
  const key = Object.keys(PANEL_CONFIG).find((k) => pathname.startsWith(k));
  return key ? PANEL_CONFIG[key] : null;
}

export const PAGE_TITLES: Record<string, string> = {
  '/dashboard':           'Overview',
  '/dashboard/feedback':  'Feedback',
  '/dashboard/roadmap':   'Roadmap',
  '/dashboard/changelog': 'Changelog',
  '/dashboard/surveys':   'Surveys',
  '/dashboard/members':   'Members',
  '/dashboard/settings':  'Settings',
};
