'use client';

import { getIconComponent } from '../constants/module-icons';

interface ModuleIconProps {
  name:       string;
  className?: string;
}

/**
 * Stable wrapper so callers never assign getIconComponent() to a capital-case
 * variable inside render (which triggers react-hooks/static-components).
 */
export function ModuleIcon({ name, className }: ModuleIconProps) {
  const Icon = getIconComponent(name);
  return <Icon className={className} />;
}
