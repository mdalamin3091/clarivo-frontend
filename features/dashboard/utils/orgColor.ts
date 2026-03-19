const ORG_COLORS = [
  'bg-indigo-500', 'bg-violet-500', 'bg-blue-500',   'bg-emerald-500',
  'bg-orange-500', 'bg-rose-500',   'bg-teal-500',   'bg-amber-500',
];

export function orgColor(name: string): string {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ORG_COLORS[hash % ORG_COLORS.length];
}
