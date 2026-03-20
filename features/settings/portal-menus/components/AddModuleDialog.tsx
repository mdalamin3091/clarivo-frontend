"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPicker } from "./IconPicker";
import type { ModulePreset, PortalMenuItem } from "../types";
import SelectModuleLink from "./SelectModuleLink";
import { MODULE_PRESETS } from "../constants";

// ── Component ─────────────────────────────────────────────────────────────────
interface AddModuleDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (module: PortalMenuItem) => void;
}

export function AddModuleDialog({
  open,
  onClose,
  onAdd,
}: AddModuleDialogProps) {
  const [selectedPreset, setSelectedPreset] = useState<ModulePreset>(
    MODULE_PRESETS[0],
  );
  const [name, setName] = useState(MODULE_PRESETS[0].name);
  const [iconName, setIconName] = useState(MODULE_PRESETS[0].iconName);
  const [customLink, setCustomLink] = useState("");

  const isCustom = selectedPreset.value === "custom";
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
      id: crypto.randomUUID(),
      name: trimmedName,
      icon: { type: "predefined", value: iconName },
      link: trimmedLink,
    });

    handlePresetSelect(MODULE_PRESETS[0]);
    setCustomLink("");
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
