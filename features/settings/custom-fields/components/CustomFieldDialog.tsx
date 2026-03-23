'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Type, Hash, Link, Calendar, ToggleLeft, ChevronDown, ListChecks, X, Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { SwitchRow } from '@/shared/components/ui/SwitchRow';
import { cn } from '@/lib/utils';
import { useCustomFieldsStore }    from '../store';
import { useCreateCustomField }    from '../hooks/useCreateCustomField';
import { useUpdateCustomField }    from '../hooks/useUpdateCustomField';
import type { CustomFieldType } from '../types';

// ── Field type options ────────────────────────────────────────────────────────

const OPTION_TYPES = new Set<CustomFieldType>(['dropdown', 'multiselect']);
const PLACEHOLDER_TYPES = new Set<CustomFieldType>(['text', 'number', 'url']);

interface TypeOption {
  type:  CustomFieldType;
  label: string;
  icon:  React.ReactNode;
}

const TYPE_OPTIONS: TypeOption[] = [
  { type: 'text',        label: 'Text',         icon: <Type        className="h-4 w-4" /> },
  { type: 'number',      label: 'Number',        icon: <Hash        className="h-4 w-4" /> },
  { type: 'url',         label: 'URL',           icon: <Link        className="h-4 w-4" /> },
  { type: 'date',        label: 'Date',          icon: <Calendar    className="h-4 w-4" /> },
  { type: 'boolean',     label: 'Switch',        icon: <ToggleLeft  className="h-4 w-4" /> },
  { type: 'dropdown',    label: 'Dropdown',      icon: <ChevronDown className="h-4 w-4" /> },
  { type: 'multiselect', label: 'Multi-select',  icon: <ListChecks  className="h-4 w-4" /> },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function CustomFieldDialog() {
  const { dialogOpen, editingField, closeDialog } = useCustomFieldsStore();
  const isEdit = !!editingField;

  // Form state
  const [name,                 setName]                 = useState('');
  const [type,                 setType]                 = useState<CustomFieldType>('text');
  const [options,              setOptions]              = useState<string[]>([]);
  const [placeholder,          setPlaceholder]          = useState('');
  const [isRequired,           setIsRequired]           = useState(false);
  const [isPrivate,            setIsPrivate]            = useState(false);
  const [showAnswerToEveryone, setShowAnswerToEveryone] = useState(false);

  // Error state
  const [nameError,    setNameError]    = useState('');
  const [optionsError, setOptionsError] = useState('');

  // Options chip input
  const [optionInput, setOptionInput] = useState('');
  const optionInputRef = useRef<HTMLInputElement>(null);

  const { mutate: create, isPending: creating } = useCreateCustomField();
  const { mutate: update, isPending: updating  } = useUpdateCustomField();
  const isPending = creating || updating;

  // Populate form on open
  useEffect(() => {
    if (dialogOpen) {
      setName(editingField?.name                 ?? '');
      setType(editingField?.type                 ?? 'text');
      setOptions(editingField?.options           ?? []);
      setPlaceholder(editingField?.placeholder   ?? '');
      setIsRequired(editingField?.isRequired     ?? false);
      setIsPrivate(editingField?.isPrivate       ?? false);
      setShowAnswerToEveryone(editingField?.showAnswerToEveryone ?? false);
      setNameError('');
      setOptionsError('');
      setOptionInput('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  // Clear options/placeholder when type changes away from relevant types
  const handleTypeChange = (t: CustomFieldType) => {
    setType(t);
    if (!OPTION_TYPES.has(t))      setOptions([]);
    if (!PLACEHOLDER_TYPES.has(t)) setPlaceholder('');
    setOptionsError('');
  };

  // Options chip logic
  const commitOption = () => {
    const val = optionInput.trim();
    if (!val) return;
    if (options.includes(val)) { setOptionInput(''); return; }
    setOptions((prev) => [...prev, val]);
    setOptionInput('');
    setOptionsError('');
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitOption();
    } else if (e.key === 'Backspace' && optionInput === '' && options.length > 0) {
      setOptions((prev) => prev.slice(0, -1));
    }
  };

  const removeOption = (opt: string) =>
    setOptions((prev) => prev.filter((o) => o !== opt));

  // Submit
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setNameError('Name is required'); return; }
    setNameError('');

    if (OPTION_TYPES.has(type) && options.length === 0) {
      setOptionsError(`At least one option is required for ${type} fields`);
      return;
    }
    setOptionsError('');

    if (isEdit) {
      update({
        id: editingField.id,
        input: {
          name:                 trimmed,
          options:              OPTION_TYPES.has(editingField.type) ? options : undefined,
          placeholder:          PLACEHOLDER_TYPES.has(editingField.type) ? placeholder || undefined : undefined,
          isRequired,
          isPrivate,
          showAnswerToEveryone,
        },
      });
    } else {
      create({
        name:                 trimmed,
        type,
        options:              OPTION_TYPES.has(type) ? options : undefined,
        placeholder:          PLACEHOLDER_TYPES.has(type) ? placeholder || undefined : undefined,
        isRequired,
        isPrivate,
        showAnswerToEveryone,
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">
            {isEdit ? 'Edit custom field' : 'Add custom field'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isEdit
              ? 'Update the field name, options, or visibility.'
              : 'Define a new metadata field for your feedback posts.'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-1 space-y-5">

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cf-name">Field name</Label>
            <Input
              id="cf-name"
              placeholder="e.g. Priority"
              value={name}
              onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>

          {/* Type selector — create only */}
          {!isEdit && (
            <div className="space-y-2">
              <Label>Field type</Label>
              <div className="grid grid-cols-4 gap-2">
                {TYPE_OPTIONS.map(({ type: t, label, icon }) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTypeChange(t)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-center transition-all',
                      type === t
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
                        : 'border-border bg-muted/20 text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/40',
                    )}
                  >
                    {icon}
                    <span className="text-xs font-medium leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Options editor — dropdown / multiselect only */}
          {OPTION_TYPES.has(isEdit ? (editingField?.type ?? type) : type) && (
            <div className="space-y-1.5">
              <Label>Options</Label>
              <div
                className="flex min-h-10 flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 cursor-text"
                onClick={() => optionInputRef.current?.focus()}
              >
                {options.map((opt) => (
                  <span
                    key={opt}
                    className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                  >
                    {opt}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeOption(opt); }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  ref={optionInputRef}
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyDown={handleOptionKeyDown}
                  onBlur={commitOption}
                  placeholder={options.length === 0 ? 'Type an option and press Enter…' : ''}
                  className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              {optionsError && <p className="text-xs text-destructive">{optionsError}</p>}
              <p className="text-xs text-muted-foreground">Press Enter or comma to add an option.</p>
            </div>
          )}

          {/* Placeholder — text / number / url only */}
          {PLACEHOLDER_TYPES.has(isEdit ? (editingField?.type ?? type) : type) && (
            <div className="space-y-1.5">
              <Label htmlFor="cf-placeholder">Placeholder <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input
                id="cf-placeholder"
                placeholder="e.g. Enter a value…"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
              />
            </div>
          )}

          {/* Toggles */}
          <div className="space-y-2">
            <SwitchRow
              checked={isRequired}
              onChange={setIsRequired}
              label="Required field"
              description="Users must fill in this field when submitting a feedback post."
            />
            <SwitchRow
              checked={isPrivate}
              onChange={setIsPrivate}
              label="Private field"
              description="This field is only visible to your team members, not to end users."
            />
            <SwitchRow
              checked={showAnswerToEveryone}
              onChange={setShowAnswerToEveryone}
              label="Show answer to everyone"
              description="The value of this field will be visible to all users on your public portal."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Save changes' : 'Add field'}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
