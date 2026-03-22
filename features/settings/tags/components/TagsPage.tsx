"use client";

import { Button } from "@/components/ui/button";
import { TagListCard } from "./TagListCard";
import { TagSettingsCard } from "./TagSettingsCard";
import { Plus } from "lucide-react";
import { useTagsStore } from "../store";

export function TagsPage() {
  const { openCreateDialog } = useTagsStore();

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-3xl space-y-6 p-6 pb-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Tags</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Manage tags and control how they are used across your public
              portal.
            </p>
          </div>
          <Button size="sm" onClick={openCreateDialog} className="shrink-0">
            <Plus className="mr-1.5 h-4 w-4" />
            Add tag
          </Button>
        </div>
        <TagListCard />
        <TagSettingsCard />
      </div>
    </div>
  );
}
