"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPicker } from "@/shared/components/ui/IconPicker";
import type { ModulePreset, PortalMenuItem } from "../types";
import SelectModuleLink from "./SelectModuleLink";
import { MODULE_PRESETS } from "../constants";

// ── Component ─────────────────────────────────────────────────────────────────
interface AddModuleDialogProps {
  open:          boolean;
  onClose:       () => void;
  onAdd:         (module: PortalMenuItem) => void;
  existingLinks: string[];
  existingCount: number;
}

export function AddModuleDialog({
  open,
  onClose,
  onAdd,
  existingLinks,
  existingCount,
}: AddModuleDialogProps) {
  const [selectedPreset, setSelectedPreset] = useState<ModulePreset>(
    MODULE_PRESETS[0],
  );
  const [name, setName] = useState(MODULE_PRESETS[0].name);
  const [iconName, setIconName] = useState(MODULE_PRESETS[0].iconName);

  const effectiveLink = selectedPreset.link;

  const handlePresetSelect = (preset: ModulePreset) => {
    setSelectedPreset(preset);
    setName(preset.name);
    setIconName(preset.iconName);
  };

  const handleCreate = () => {
    const trimmedName = name.trim();
    const trimmedLink = effectiveLink.trim();
    if (!trimmedName || !trimmedLink) return;

    const isDuplicate = existingLinks.some(
      (l) => l.toLowerCase() === trimmedLink.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error("Duplicate link", {
        description: `"${trimmedName}" is already used by another menu item.`,
      });
      return;
    }

    onAdd({
      id:    crypto.randomUUID(),
      name:  trimmedName,
      icon:  { type: "predefined", value: iconName },
      link:  trimmedLink,
      order: existingCount + 1,
    });

    handlePresetSelect(MODULE_PRESETS[0]);
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
            <Label className="text-xs font-medium text-muted-foreground">
              Icon &amp; Name
            </Label>
            <div className="flex items-center gap-2">
              <IconPicker value={iconName} onChange={setIconName} />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter menu item name (en)"
                className="h-9 flex-1 rounded-lg text-sm"
              />
            </div>
          </div>
          <SelectModuleLink
            selectedPreset={selectedPreset}
            onSelect={handlePresetSelect}
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
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
