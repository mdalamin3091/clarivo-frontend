'use client';

import React from 'react';
import Image from 'next/image';
import { ICON_MAP, isEmoji, isImageUrl } from '@/shared/components/ui/IconPicker';
import { HelpCircle } from 'lucide-react';

interface ModuleIconProps {
  name:       string;
  className?: string;
}

export function ModuleIcon({ name, className }: ModuleIconProps) {
  if (isImageUrl(name)) {
    return <Image src={name} alt="icon" width={16} height={16} className={className} style={{ objectFit: 'cover', borderRadius: 2 }} unoptimized />;
  }
  if (isEmoji(name)) {
    return <span className={className} style={{ fontSize: '1em', lineHeight: 1 }}>{name}</span>;
  }
  const Icon = ICON_MAP[name] ?? HelpCircle;
  return React.createElement(Icon, { className });
}
