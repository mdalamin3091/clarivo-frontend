'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCustomFieldsStore }  from '../store';
import { CustomFieldListCard }   from './CustomFieldListCard';

export function CustomFieldsPage() {
  const { openCreateDialog } = useCustomFieldsStore();

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-3xl space-y-6 p-6 pb-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Custom fields</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Define structured metadata fields that your team can fill in on feedback posts.
            </p>
          </div>
          <Button size="sm" onClick={openCreateDialog} className="shrink-0">
            <Plus className="mr-1.5 h-4 w-4" />
            Add field
          </Button>
        </div>
        <CustomFieldListCard />
      </div>
    </div>
  );
}
