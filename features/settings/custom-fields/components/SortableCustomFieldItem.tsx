'use client';

import { CustomFieldRow } from './CustomFieldRow';
import type { CustomField } from '../types';

interface Props {
  field:           CustomField;
  dragHandleRef:   (el: HTMLElement | null) => void;
  dragHandleProps: React.HTMLAttributes<HTMLElement>;
}

export function SortableCustomFieldItem({ field, dragHandleRef, dragHandleProps }: Props) {
  return (
    <CustomFieldRow
      field={field}
      dragHandleRef={dragHandleRef}
      dragHandleProps={dragHandleProps}
    />
  );
}
