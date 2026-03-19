import { MessageSquare, BarChart2, BookOpen, ClipboardList } from 'lucide-react';

/**
 * Available workspace modules shown in step 1 of onboarding.
 * Extracted so it can be referenced independently of the view component.
 */
export const ONBOARDING_MODULES = [
  {
    id: 'feedback',
    label: 'Feedback',
    description: 'Collect and prioritize feature requests from users',
    icon: MessageSquare,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    description: 'Plan and communicate your product direction',
    icon: BarChart2,
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
  },
  {
    id: 'changelog',
    label: 'Changelog',
    description: "Keep users informed about what's new",
    icon: BookOpen,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    id: 'survey',
    label: 'Surveys',
    description: 'Gather structured feedback with custom forms',
    icon: ClipboardList,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
  },
] as const;
