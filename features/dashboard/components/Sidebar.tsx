'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Map,
  Newspaper,
  ClipboardList,
  Bell,
  BarChart2,
  Settings,
  LogOut,
  Check,
  Loader2,
  Plus,
  ChevronDown,
  HelpCircle,
  Code2,
  Circle,
} from 'lucide-react';
import {
  authClient,
  signOut,
  useSession,
  useListOrganizations,
  useActiveOrganization,
} from '@/lib/auth-client';
import { useUIStore } from '@/store/ui';

// ── Org avatar colour (deterministic by name) ──────────────────────────────
const ORG_COLORS = [
  'bg-indigo-500', 'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-orange-500', 'bg-rose-500',   'bg-teal-500', 'bg-amber-500',
];
function orgColor(name: string): string {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ORG_COLORS[hash % ORG_COLORS.length];
}

// ── Navigation config ──────────────────────────────────────────────────────
const MODULE_ICONS = [
  { label: 'Dashboard',  href: '/dashboard',            icon: LayoutDashboard, exact: true },
  { label: 'Feedback',   href: '/dashboard/feedback',   icon: MessageSquare },
  { label: 'Roadmap',    href: '/dashboard/roadmap',    icon: Map },
  { label: 'Changelog',  href: '/dashboard/changelog',  icon: Newspaper },
  { label: 'Surveys',    href: '/dashboard/surveys',    icon: ClipboardList },
];

const BOTTOM_ICONS = [
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Analytics',     href: '/dashboard/analytics',     icon: BarChart2 },
  { label: 'Settings',      href: '/dashboard/settings',      icon: Settings },
];

// ── Dynamic second-sidebar panel config ───────────────────────────────────
type PanelItem    = { label: string; href: string; color?: string };
type PanelSection = { title: string; items: PanelItem[] };
type PanelConfig  = { heading: string; sections: PanelSection[] };

const PANEL_CONFIG: Record<string, PanelConfig> = {
  '/dashboard/feedback': {
    heading: 'Feedback',
    sections: [
      {
        title: 'Status',
        items: [
          { label: 'In Review', href: '/dashboard/feedback?status=in-review', color: 'bg-yellow-400' },
          { label: 'Active',    href: '/dashboard/feedback?status=active',    color: 'bg-green-400'  },
          { label: 'Closed',   href: '/dashboard/feedback?status=closed',   color: 'bg-red-400'    },
          { label: 'Done',     href: '/dashboard/feedback?status=done',     color: 'bg-blue-400'   },
        ],
      },
      {
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
        title: 'Status',
        items: [
          { label: 'Planned',     href: '/dashboard/roadmap?status=planned',     color: 'bg-slate-400'  },
          { label: 'In Progress', href: '/dashboard/roadmap?status=in-progress', color: 'bg-blue-400'   },
          { label: 'Completed',   href: '/dashboard/roadmap?status=completed',   color: 'bg-green-400'  },
        ],
      },
      {
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
        title: 'Status',
        items: [
          { label: 'Published',  href: '/dashboard/changelog?status=published',  color: 'bg-green-400'  },
          { label: 'Draft',      href: '/dashboard/changelog?status=draft',      color: 'bg-slate-400'  },
          { label: 'Scheduled',  href: '/dashboard/changelog?status=scheduled',  color: 'bg-yellow-400' },
        ],
      },
    ],
  },
  '/dashboard/surveys': {
    heading: 'Surveys',
    sections: [
      {
        title: 'Status',
        items: [
          { label: 'Active', href: '/dashboard/surveys?status=active', color: 'bg-green-400'  },
          { label: 'Draft',  href: '/dashboard/surveys?status=draft',  color: 'bg-slate-400'  },
          { label: 'Closed', href: '/dashboard/surveys?status=closed', color: 'bg-red-400'    },
        ],
      },
    ],
  },
  '/dashboard/settings': {
    heading: 'Settings',
    sections: [
      {
        title: 'General',
        items: [
          { label: 'Workspace',    href: '/dashboard/settings' },
          { label: 'Members',      href: '/dashboard/settings/members' },
          { label: 'Billing',      href: '/dashboard/settings/billing' },
        ],
      },
      {
        title: 'Integrations',
        items: [
          { label: 'API Keys',     href: '/dashboard/settings/api-keys' },
          { label: 'Webhooks',     href: '/dashboard/settings/webhooks' },
        ],
      },
    ],
  },
};

/** Returns the panel config whose route prefix matches the current pathname. */
function getPanel(pathname: string): PanelConfig | null {
  const key = Object.keys(PANEL_CONFIG).find((k) => pathname.startsWith(k));
  return key ? PANEL_CONFIG[key] : null;
}

// ── Component ──────────────────────────────────────────────────────────────
export function Sidebar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { sidebarOpen } = useUIStore();

  const { data: session }   = useSession();
  const { data: orgs }      = useListOrganizations();
  const { data: activeOrg } = useActiveOrganization();

  const [switching,   setSwitching]   = useState<string | null>(null);
  const [orgOpen,     setOrgOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const orgRef     = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (orgRef.current && !orgRef.current.contains(e.target as Node))
        setOrgOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/onboarding');
  };

  const handleSwitch = async (orgId: string) => {
    if (orgId === activeOrg?.id) return;
    setSwitching(orgId);
    await authClient.organization.setActive({ organizationId: orgId });
    setSwitching(null);
    setOrgOpen(false);
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const userInitial     = session?.user.name?.charAt(0).toUpperCase() ?? '?';
  const activeOrgColor  = activeOrg ? orgColor(activeOrg.name) : 'bg-indigo-500';
  const activeOrgLetter = activeOrg?.name.charAt(0).toUpperCase() ?? '?';

  const panel = getPanel(pathname);

  // ── icon rail button style helper
  const railBtn = (href: string, exact?: boolean) =>
    `flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
      isActive(href, exact)
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    }`;

  return (
    <aside className="flex h-screen shrink-0">

      {/* ════════════════════════════════════
          COLUMN 1 — Icon Rail (48 px)
      ════════════════════════════════════ */}
      <div className="flex w-12 flex-col items-center border-r bg-card py-3 gap-0.5">

        {/* Active workspace badge → org dropdown */}
        <div ref={orgRef} className="relative mb-2">
          <button
            onClick={() => setOrgOpen((o) => !o)}
            title={activeOrg?.name ?? 'Switch workspace'}
            className={`group relative flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold text-white transition-opacity hover:opacity-85 ${activeOrgColor}`}
          >
            {activeOrgLetter}
            <ChevronDown className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-card text-muted-foreground" />
          </button>

          {orgOpen && (
            <div className="absolute left-full top-0 z-50 ml-3 w-60 overflow-hidden rounded-xl border bg-popover shadow-xl">
              <div className="border-b px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Workspaces
                </p>
              </div>

              <div className="max-h-64 overflow-y-auto p-1">
                {orgs && orgs.length > 0 ? (
                  <ul className="space-y-0.5">
                    {orgs.map((org) => {
                      const active      = org.id === activeOrg?.id;
                      const isSwitching = switching === org.id;
                      return (
                        <li key={org.id}>
                          <button
                            onClick={() => handleSwitch(org.id)}
                            disabled={isSwitching}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors disabled:opacity-50 ${
                              active
                                ? 'bg-accent font-medium text-foreground'
                                : 'text-foreground/80 hover:bg-accent hover:text-foreground'
                            }`}
                          >
                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[11px] font-bold text-white ${orgColor(org.name)}`}>
                              {isSwitching
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : org.name.charAt(0).toUpperCase()
                              }
                            </div>
                            <span className="flex-1 truncate">{org.name}</span>
                            {active && !isSwitching && (
                              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="px-2 py-2 text-xs text-muted-foreground">No workspaces yet.</p>
                )}
              </div>

              <div className="border-t p-1">
                <button
                  onClick={() => { setOrgOpen(false); router.push('/onboarding'); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-dashed border-border">
                    <Plus className="h-3.5 w-3.5" />
                  </div>
                  Create workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Module nav icons */}
        <div className="flex flex-1 flex-col items-center gap-0.5 pt-1">
          {MODULE_ICONS.map(({ label, href, icon: Icon, exact }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              title={label}
              className={railBtn(href, exact)}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Bottom icons */}
        <div className="flex flex-col items-center gap-0.5">
          {BOTTOM_ICONS.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              title={label}
              className={railBtn(href)}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}

          {/* User avatar + profile popup */}
          <div ref={profileRef} className="relative mt-1">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              title={session?.user.name ?? 'Profile'}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
            >
              {userInitial}
            </button>

            {profileOpen && (
              <div className="absolute bottom-0 left-full ml-3 w-56 rounded-xl border bg-popover shadow-xl">
                <div className="border-b px-3 py-3">
                  <p className="text-sm font-semibold text-foreground">{session?.user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{session?.user.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          COLUMN 2 — Dynamic Panel
          Shown only when a panel exists for
          the current route & sidebarOpen
      ════════════════════════════════════ */}
      {panel && sidebarOpen && (
        <div className="flex w-52 flex-col border-r bg-card">

          {/* Panel header */}
          <div className="flex h-16 shrink-0 items-center border-b px-4">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {panel.heading}
            </span>
          </div>

          {/* Panel sections */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
            {panel.sections.map((section) => (
              <div key={section.title}>
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = pathname + (typeof window !== 'undefined' ? window.location.search : '') === item.href
                      || (item.href === pathname && !item.href.includes('?'));
                    return (
                      <li key={item.href}>
                        <button
                          onClick={() => router.push(item.href)}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                            active
                              ? 'bg-accent font-medium text-foreground'
                              : 'text-foreground/80 hover:bg-accent hover:text-foreground'
                          }`}
                        >
                          {item.color ? (
                            <span className={`h-2 w-2 shrink-0 rounded-full ${item.color}`} />
                          ) : (
                            <Circle className="h-2 w-2 shrink-0 text-muted-foreground/40" />
                          )}
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Resources footer */}
          <div className="shrink-0 border-t px-2 py-2">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Resources
            </p>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Code2 className="h-3.5 w-3.5 shrink-0" />
              Install Widget &amp; Embed
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <HelpCircle className="h-3.5 w-3.5 shrink-0" />
              Help Center
            </button>
          </div>

        </div>
      )}
    </aside>
  );
}
