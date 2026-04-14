const AVATAR_COLORS = [
  'bg-violet-500', 'bg-blue-500',   'bg-emerald-500', 'bg-orange-500',
  'bg-pink-500',   'bg-indigo-500', 'bg-teal-500',    'bg-rose-500',
];

export function getAvatarColor(name: string): string {
  const idx = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}
