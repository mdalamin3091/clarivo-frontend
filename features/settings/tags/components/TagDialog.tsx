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
import { SwitchRow } from '@/shared/components/ui/SwitchRow';
import { useTagsStore }   from '../store';
import { useCreateTag }   from '../hooks/useCreateTag';
import { useUpdateTag }   from '../hooks/useUpdateTag';

export function TagDialog() {
  const { dialogOpen, editingTag, closeDialog } = useTagsStore();
  const isEdit = !!editingTag;

  const [name,      setName]      = useState('');
  const [color,     setColor]     = useState<string>(STATUS_COLORS[0]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [nameError, setNameError] = useState('');

  const { mutate: create, isPending: creating } = useCreateTag();
  const { mutate: update, isPending: updating  } = useUpdateTag();
  const isPending = creating || updating;

  useEffect(() => {
    if (dialogOpen) {
      setName(editingTag?.name      ?? '');
      setColor(editingTag?.color    ?? STATUS_COLORS[0]);
      setIsPrivate(editingTag?.isPrivate ?? false);
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
      update({ id: editingTag.id, input: { name: trimmed, color, isPrivate } });
    } else {
      create({ name: trimmed, color, isPrivate });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">
            {isEdit ? 'Edit tag' : 'Add tag'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isEdit
              ? 'Update the name, color, or visibility for this tag.'
              : 'Create a new tag to categorize feedback posts.'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-1 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="tag-name">Name</Label>
            <Input
              id="tag-name"
              placeholder="e.g. Bug"
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

          {/* Private toggle */}
          <SwitchRow
            checked={isPrivate}
            onChange={setIsPrivate}
            label="Private tag"
            description="Private tags are only visible to your team members, not to end users."
          />

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Save changes' : 'Add tag'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
