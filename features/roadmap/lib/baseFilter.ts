import {
  TrendingUp,
  Clock,
  Flame,
  CalendarClock,
  ArrowUpDown,
  DollarSign,
  Clock3,
  type LucideIcon,
} from 'lucide-react';

// ── Sort options ───────────────────────────────────────────────────────────────

export type SortOption =
  | 'topVoted'
  | 'recent'
  | 'trending'
  | 'dueDate'
  | 'manual'
  | 'upvoterMrr'
  | 'pending';

export interface SortOptionDef {
  value: SortOption;
  label: string;
  icon:  LucideIcon;
}

export const SORT_OPTIONS: SortOptionDef[] = [
  { value: 'topVoted',    label: 'Top upvoted posts', icon: TrendingUp   },
  { value: 'recent',      label: 'Recent posts',      icon: Clock        },
  { value: 'trending',    label: 'Trending posts',    icon: Flame        },
  { value: 'dueDate',     label: 'Due date',          icon: CalendarClock },
  { value: 'manual',      label: 'Manual order',      icon: ArrowUpDown  },
  { value: 'upvoterMrr',  label: 'Upvoter MRR',       icon: DollarSign   },
  { value: 'pending',     label: 'Pending posts',     icon: Clock3       },
];

// ── Filter params ──────────────────────────────────────────────────────────────

export interface BaseFilterParams {
  sort?:     SortOption;
  boardId?:  string;
  statusId?: string;
  tagId?:    string;
}

// ── Parse / build ──────────────────────────────────────────────────────────────

export function parseBaseFilter(s: string): BaseFilterParams {
  if (!s) return {};
  const p = new URLSearchParams(s);
  return {
    sort:     (p.get('sort')     as SortOption | null) ?? undefined,
    boardId:  p.get('boardId')   ?? undefined,
    statusId: p.get('statusId')  ?? undefined,
    tagId:    p.get('tagId')     ?? undefined,
  };
}

export function buildBaseFilter(params: BaseFilterParams): string {
  const p = new URLSearchParams();
  if (params.sort)     p.set('sort',     params.sort);
  if (params.boardId)  p.set('boardId',  params.boardId);
  if (params.statusId) p.set('statusId', params.statusId);
  if (params.tagId)    p.set('tagId',    params.tagId);
  return p.toString();
}
