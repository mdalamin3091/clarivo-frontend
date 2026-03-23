/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { ColorSwatchPicker, STATUS_COLORS } from '@/shared/components/ui/ColorSwatchPicker';
import { useStatusesStore } from '../store';
import { useCreateStatus }  from '../hooks/useCreateStatus';
import { useUpdateStatus }  from '../hooks/useUpdateStatus';

export function StatusDialog() {
  const { dialogOpen, editingStatus, closeDialog } = useStatusesStore();
  const isEdit = !!editingStatus;

  const [name,  setName]  = useState('');
  const [color, setColor] = useState<string>(STATUS_COLORS[0]);
  const [nameError, setNameError] = useState('');

  const { mutate: create, isPending: creating } = useCreateStatus();
  const { mutate: update, isPending: updating  } = useUpdateStatus();
  const isPending = creating || updating;

  // Populate form when opening — same pattern as BoardDialog
  useEffect(() => {
    if (dialogOpen) {
      setName(editingStatus?.name  ?? '');
      setColor(editingStatus?.color ?? STATUS_COLORS[0]);
      setNameError('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setNameError('Name is required'); return; }
    setNameError('');

    if (isEdit) {
      update({ id: editingStatus.id, input: { name: trimmed, color } });
    } else {
      create({ name: trimmed, color });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">
            {isEdit ? 'Edit status' : 'Add status'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isEdit ? 'Update the name or color for this status.' : 'Create a new status for your feedback posts.'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-1 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="status-name">Name</Label>
            <Input
              id="status-name"
              placeholder="e.g. Under Review"
              value={name}
              onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>
              <ColorSwatchPicker value={color} onChange={setColor} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Save changes' : 'Add status'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
