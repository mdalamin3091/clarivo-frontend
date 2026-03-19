'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Map,
  Newspaper,
  ClipboardList,
  Users,
  Settings,
  ChevronLeft,
  LogOut,
  ChevronsUpDown,
} from 'lucide-react';
import { signOut, useSession } from '@/lib/auth-client';
import { useUIStore } from '@/store/ui';
import { Logo } from '@/shared/components/Logo';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

const MAIN_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Feedback', href: '/dashboard/feedback', icon: MessageSquare },
  { label: 'Roadmap', href: '/dashboard/roadmap', icon: Map },
  { label: 'Changelog', href: '/dashboard/changelog', icon: Newspaper },
  { label: 'Surveys', href: '/dashboard/surveys', icon: ClipboardList },
];

const WORKSPACE_NAV = [
  { label: 'Members', href: '/dashboard/members', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { data: session } = useSession();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/onboarding');
  };

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const navItemClass = (href: string) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive(href)
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    } ${!sidebarOpen ? 'justify-center px-0' : ''}`;

  const initial = session?.user.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <aside
      className={`relative flex h-screen flex-col border-r bg-card transition-[width] duration-200 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* ── Logo + collapse toggle ── */}
      <div
        className={`flex h-14 shrink-0 items-center border-b px-4 ${
          sidebarOpen ? 'justify-between' : 'justify-center'
        }`}
      >
        {sidebarOpen && <Logo size="sm" />}
        <button
          onClick={toggleSidebar}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-200 ${!sidebarOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* ── Workspace switcher ── */}
      <div className="shrink-0 border-b">
        <WorkspaceSwitcher collapsed={!sidebarOpen} />
      </div>

      {/* ── Main navigation ── */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {MAIN_NAV.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <button
                onClick={() => router.push(href)}
                title={!sidebarOpen ? label : undefined}
                className={navItemClass(href)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </button>
            </li>
          ))}
        </ul>

        {/* Workspace section */}
        <div className="mt-4">
          {sidebarOpen ? (
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
              Workspace
            </p>
          ) : (
            <div className="my-3 border-t" />
          )}
          <ul className="space-y-0.5">
            {WORKSPACE_NAV.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <button
                  onClick={() => router.push(href)}
                  title={!sidebarOpen ? label : undefined}
                  className={navItemClass(href)}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen && <span>{label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Profile section ── */}
      <div className="shrink-0 border-t p-2" ref={profileRef}>
        <div className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            title={!sidebarOpen ? (session?.user.name ?? 'Profile') : undefined}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent ${
              !sidebarOpen ? 'justify-center px-0' : ''
            }`}
          >
            {/* Avatar */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {initial}
            </div>
            {sidebarOpen && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {session?.user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session?.user.email}
                  </p>
                </div>
                <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </>
            )}
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div
              className={`absolute bottom-full mb-1 rounded-xl border bg-popover shadow-lg ${
                sidebarOpen ? 'left-0 w-full' : 'left-full ml-2 w-52'
              }`}
            >
              {/* User info header */}
              <div className="border-b px-3 py-2.5">
                <p className="text-sm font-semibold text-foreground">{session?.user.name}</p>
                <p className="text-xs text-muted-foreground">{session?.user.email}</p>
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
    </aside>
  );
}
