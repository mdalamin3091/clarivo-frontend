import {
  Type, Hash, Link, Calendar, ToggleLeft, ChevronDown, ListChecks,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CustomFieldType } from './types';

export const FIELD_TYPE_VALUES = [
  'text', 'number', 'url', 'date', 'boolean', 'dropdown', 'multiselect',
] as const satisfies readonly CustomFieldType[];

export const OPTION_TYPES      = new Set<CustomFieldType>(['dropdown', 'multiselect']);
export const PLACEHOLDER_TYPES = new Set<CustomFieldType>(['text', 'number', 'url']);

export interface TypeOption {
  type:  CustomFieldType;
  label: string;
  Icon:  LucideIcon;
}

export const TYPE_OPTIONS: TypeOption[] = [
  { type: 'text',        label: 'Text',         Icon: Type         },
  { type: 'number',      label: 'Number',        Icon: Hash         },
  { type: 'url',         label: 'URL',           Icon: Link         },
  { type: 'date',        label: 'Date',          Icon: Calendar     },
  { type: 'boolean',     label: 'Switch',        Icon: ToggleLeft   },
  { type: 'dropdown',    label: 'Dropdown',      Icon: ChevronDown  },
  { type: 'multiselect', label: 'Multi-select',  Icon: ListChecks   },
];

/** Map for O(1) label/icon lookup in rows etc. */
export const TYPE_META = Object.fromEntries(
  TYPE_OPTIONS.map(({ type, label, Icon }) => [type, { label, Icon }]),
) as Record<CustomFieldType, { label: string; Icon: LucideIcon }>;
