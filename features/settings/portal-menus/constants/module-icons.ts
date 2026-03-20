import type { FC } from 'react';
import type { LucideProps } from 'lucide-react';
import {
  MessageSquare, Map, RefreshCw, ClipboardList, BookOpen, BarChart2,
  Users, Bell, Globe, Star, Flag, Zap, HelpCircle, Code2, Settings,
  Link as LinkIcon, FileText, Lightbulb, Target, Layers, GitBranch,
  Package, Rocket, Compass,
} from 'lucide-react';

export interface PredefinedIcon {
  name: string;
  label: string;
}

// Static map — dynamic namespace access (LucideIcons[name]) is unreliable
// across bundlers. Every icon used anywhere must be listed here explicitly.
const ICON_MAP: Record<string, FC<LucideProps>> = {
  MessageSquare, Map, RefreshCw, ClipboardList, BookOpen, BarChart2,
  Users, Bell, Globe, Star, Flag, Zap, HelpCircle, Code2, Settings,
  Link: LinkIcon, FileText, Lightbulb, Target, Layers, GitBranch,
  Package, Rocket, Compass,
};

export const PREDEFINED_ICONS: PredefinedIcon[] = [
  { name: 'MessageSquare', label: 'Feedback' },
  { name: 'Map',           label: 'Roadmap' },
  { name: 'RefreshCw',     label: 'Changelog' },
  { name: 'ClipboardList', label: 'Survey' },
  { name: 'BookOpen',      label: 'Docs' },
  { name: 'BarChart2',     label: 'Analytics' },
  { name: 'Users',         label: 'Team' },
  { name: 'Bell',          label: 'Notifications' },
  { name: 'Globe',         label: 'Portal' },
  { name: 'Star',          label: 'Favorites' },
  { name: 'Flag',          label: 'Goals' },
  { name: 'Zap',           label: 'Launches' },
  { name: 'HelpCircle',    label: 'Help' },
  { name: 'Code2',         label: 'Developer' },
  { name: 'Settings',      label: 'Settings' },
  { name: 'Link',          label: 'Link' },
  { name: 'FileText',      label: 'Document' },
  { name: 'Lightbulb',     label: 'Ideas' },
  { name: 'Target',        label: 'Targets' },
  { name: 'Layers',        label: 'Layers' },
  { name: 'GitBranch',     label: 'Git' },
  { name: 'Package',       label: 'Package' },
  { name: 'Rocket',        label: 'Launch' },
  { name: 'Compass',       label: 'Explore' },
];

export function getIconComponent(name: string): FC<LucideProps> {
  return ICON_MAP[name] ?? HelpCircle;
}
