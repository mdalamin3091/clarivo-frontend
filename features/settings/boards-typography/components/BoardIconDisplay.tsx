import React from 'react';
import Image from 'next/image';
import { ICON_MAP, isEmoji, isImageUrl } from '@/shared/components/ui/IconPicker';
import type { BoardIcon } from '../types';

interface Props {
  icon: BoardIcon;
  className?: string;
}

export function BoardIconDisplay({ icon, className = 'h-4 w-4' }: Props) {
  const { value } = icon;

  if (isImageUrl(value)) {
    return (
      <Image src={value} alt="board icon" width={16} height={16} className="rounded object-cover" unoptimized />
    );
  }

  if (isEmoji(value)) {
    return <span className="text-base leading-none">{value}</span>;
  }

  const Comp = ICON_MAP[value];
  if (Comp) return React.createElement(Comp, { className });

  return <span className="text-muted-foreground text-xs">—</span>;
}
