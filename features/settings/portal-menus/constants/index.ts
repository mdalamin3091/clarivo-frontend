import type { ModulePreset } from '../types';

export const MODULE_PRESETS: ModulePreset[] = [
  { value: 'feedback',  label: 'Feedback module',  name: 'Feedback',  link: '/feedback',  iconName: 'MessageSquare' },
  { value: 'roadmap',   label: 'Roadmap module',   name: 'Roadmap',   link: '/roadmap',   iconName: 'Map' },
  { value: 'changelog', label: 'Changelog module', name: 'Changelog', link: '/changelog', iconName: 'RefreshCw' },
];
