'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

const ITEM_VALUE = 'section';

interface SectionAccordionProps {
  title:             React.ReactNode;
  children:          React.ReactNode;
  /** Rendered as a styled pill badge inside the trigger, before the chevron */
  badge?:            React.ReactNode;
  /** Overrides the outer Accordion wrapper classes */
  className?:        string;
  /** Overrides the AccordionTrigger classes */
  triggerClassName?: string;
  /** Overrides the AccordionContent classes */
  contentClassName?: string;
  /** Controlled open state */
  open?:             boolean;
  onOpenChange?:     (open: boolean) => void;
  /** Uncontrolled initial state (ignored when open/onOpenChange are provided) */
  defaultOpen?:      boolean;
}

export function SectionAccordion({
  title,
  children,
  badge,
  className,
  triggerClassName,
  contentClassName,
  open,
  onOpenChange,
  defaultOpen = false,
}: SectionAccordionProps) {
  const controlled = open !== undefined;

  const accordionProps = controlled
    ? {
        value:         open ? ITEM_VALUE : '',
        onValueChange: (v: string) => onOpenChange?.(v === ITEM_VALUE),
      }
    : {
        defaultValue: defaultOpen ? ITEM_VALUE : undefined,
      };

  return (
    <Accordion
      type="single"
      collapsible
      className={cn('rounded-lg border border-border overflow-hidden', className)}
      {...accordionProps}
    >
      <AccordionItem value={ITEM_VALUE} className="border-0 bg-muted/30">
        <AccordionTrigger
          className={cn(
            'px-4 py-3 text-sm font-semibold text-foreground hover:no-underline',
            'bg-muted/50 hover:bg-muted data-[state=open]:bg-muted/20',
            triggerClassName,
          )}
        >
          <span className="flex flex-1 items-center gap-2 truncate">
            {title}
          </span>
          {badge && (
            <span className="mr-2 shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {badge}
            </span>
          )}
        </AccordionTrigger>
        <AccordionContent className={cn('px-4 pb-4 pt-0', contentClassName)}>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
