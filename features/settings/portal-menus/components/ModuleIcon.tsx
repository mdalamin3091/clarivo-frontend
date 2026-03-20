'use client';

import React from 'react';
import { ICON_MAP, isEmoji } from '@/shared/components/ui/IconPicker';
import { HelpCircle } from 'lucide-react';

interface ModuleIconProps {
  name:       string;
  className?: string;
}

export function ModuleIcon({ name, className }: ModuleIconProps) {
  if (isEmoji(name)) {
    return <span className={className} style={{ fontSize: '1em', lineHeight: 1 }}>{name}</span>;
  }
  const Icon = ICON_MAP[name] ?? HelpCircle;
  return React.createElement(Icon, { className });
}
