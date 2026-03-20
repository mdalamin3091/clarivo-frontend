'use client';

import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import { IconPicker } from './IconPicker';
import { ModuleIcon } from './ModuleIcon';
import type { PortalMenuItem } from '../types';

// ── Module preset options ──────────────────────────────────────────────────────

interface ModulePreset {
  value:    string;
  label:    string;
  name:     string;
  link:     string;
  iconName: string;
}

const MODULE_PRESETS: ModulePreset[] = [
  { value: 'feedback',    label: 'Feedback module',    name: 'Feedback',    link: '/feedback',    iconName: 'MessageSquare' },
  { value: 'roadmap',     label: 'Roadmap module',     name: 'Roadmap',     link: '/roadmap',     iconName: 'Map' },
  { value: 'changelog',   label: 'Changelog module',   name: 'Changelog',   link: '/changelog',   iconName: 'RefreshCw' },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface AddModuleDialogProps {
  open:    boolean;
  onClose: () => void;
  onAdd:   (module: PortalMenuItem) => void;
}

export function AddModuleDialog({ open, onClose, onAdd }: AddModuleDialogProps) {
  const [selectedPreset, setSelectedPreset] = useState<ModulePreset>(MODULE_PRESETS[0]);
  const [name, setName]                     = useState(MODULE_PRESETS[0].name);
  const [iconName, setIconName]             = useState(MODULE_PRESETS[0].iconName);
  const [customLink, setCustomLink]         = useState('');

  const isCustom      = selectedPreset.value === 'custom';
  const effectiveLink = isCustom ? customLink : selectedPreset.link;

  const handlePresetSelect = (preset: ModulePreset) => {
    setSelectedPreset(preset);
    setName(preset.name);
    setIconName(preset.iconName);
  };

  const handleCreate = () => {
    const trimmedName = name.trim();
    const trimmedLink = effectiveLink.trim();
    if (!trimmedName || !trimmedLink) return;

    onAdd({
      id:   crypto.randomUUID(),
      name: trimmedName,
      icon: { type: 'predefined', value: iconName },
      link: trimmedLink,
    });

    handlePresetSelect(MODULE_PRESETS[0]);
    setCustomLink('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Create Menu Item</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enter the details for the new menu item.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-1">

          {/* ── Icon & Name ── */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Icon &amp; Name</Label>
            <div className="flex items-center gap-2">
              <IconPicker value={iconName} onChange={setIconName} />
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter menu item name (en)"
                className="h-9 flex-1 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* ── Link (shadcn DropdownMenu) ── */}
          <div className="space-y-1.5 max-w-fit">
            <Label className="text-xs font-medium text-muted-foreground">Link</Label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-9 w-full items-center gap-2 rounded-lg border bg-background px-3 text-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ModuleIcon
                    name={selectedPreset.iconName}
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                  />
                  <span className="flex-1 text-left text-foreground">{selectedPreset.label}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width]"
              >
                {MODULE_PRESETS.map(preset => (
                  <DropdownMenuItem
                    key={preset.value}
                    onClick={() => handlePresetSelect(preset)}
                    className="gap-2.5"
                  >
                    <ModuleIcon
                      name={preset.iconName}
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                    />
                    {preset.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            onClick={handleCreate}
            disabled={!name.trim() || !effectiveLink.trim()}
          >
            Create Menu Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
