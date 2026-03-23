"use client";

import { useState } from "react";
import {
  Pencil,
  Trash2,
  Loader2,
  Globe,
  Users,
  Plus,
  GripVertical,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { SectionAccordion } from "@/shared/components/ui/SectionAccordion";
import { SortableList } from "@/shared/components/ui/SortableList";
import { BoardIconDisplay } from "@/features/settings/boards-typography/components/BoardIconDisplay";
import { useDeleteRoadmap } from "../hooks/useDeleteRoadmap";
import { useCreateRoadmapColumn } from "../hooks/useCreateRoadmapColumn";
import { useReorderRoadmapColumns } from "../hooks/useReorderRoadmapColumns";
import { useRoadmapStore } from "../store";
import { RoadmapColumnItem } from "./RoadmapColumnItem";
import type { Roadmap, RoadmapColumn } from "../types";

interface Props {
  roadmap: Roadmap;
  dragHandleRef: (el: HTMLElement | null) => void;
  dragHandleProps: React.HTMLAttributes<HTMLElement>;
}

export function RoadmapCard({
  roadmap,
  dragHandleRef,
  dragHandleProps,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [openColumnId, setOpenColumnId] = useState<string>("");

  const openEditDialog = useRoadmapStore((s) => s.openEditDialog);

  const { mutate: del, isPending: deleting } = useDeleteRoadmap();
  const { mutate: addCol, isPending: addingCol } = useCreateRoadmapColumn();
  const { mutate: reorderCols } = useReorderRoadmapColumns();

  const columns = useRoadmapStore(
    (s) =>
      s.roadmaps.find((r) => r.id === roadmap.id)?.columns ?? roadmap.columns,
  );

  const handleAddColumn = () => {
    if (!columnsOpen) setColumnsOpen(true);
    addCol(roadmap.id, {
      onSuccess: (updatedRoadmap) => {
        const newCol = updatedRoadmap.columns.at(-1);
        if (newCol) setOpenColumnId(newCol.id);
      },
    });
  };

  const handleReorder = (reordered: RoadmapColumn[]) => {
    reorderCols({ roadmapId: roadmap.id, columns: reordered });
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card">
        {/* Header row */}
        <div className="flex items-center gap-2 px-3 py-3">
          {/* Roadmap drag handle */}
          <button
            ref={dragHandleRef}
            {...dragHandleProps}
            type="button"
            className="cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0"
            aria-label="Drag to reorder roadmap"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <BoardIconDisplay
            icon={roadmap.icon}
            className="h-4 w-4 shrink-0 text-muted-foreground"
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {roadmap.name}
            </p>
            {roadmap.description && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {roadmap.description}
              </p>
            )}
          </div>

          <span className="hidden sm:flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {roadmap.visibility === "everyone" ? (
              <>
                <Globe className="h-3 w-3" /> Everyone
              </>
            ) : (
              <>
                <Users className="h-3 w-3" /> Team only
              </>
            )}
          </span>

          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {columns.length} {columns.length === 1 ? "column" : "columns"}
          </span>

          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
              onClick={() => openEditDialog(roadmap)}
            >
              <Pencil className="h-3.5 w-3.5" />
              <span className="text-xs">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-muted-foreground hover:text-destructive"
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              <span className="text-xs">Delete</span>
            </Button>
          </div>
        </div>

        {/* Collapsible columns section */}
        <SectionAccordion
          title="Columns"
          badge={columns.length > 0 ? `${columns.length}` : undefined}
          open={columnsOpen}
          onOpenChange={setColumnsOpen}
          className="rounded-none border-x-0 border-b-0 border-t border-border rounded-bl-xl rounded-br-xl"
          triggerClassName="px-4 py-2 text-xs font-medium "
          contentClassName="px-4 pb-4 pt-1"
        >
          <div className="space-y-2">
            {columns.length > 0 ? (
              <Accordion
                type="single"
                collapsible
                value={openColumnId}
                onValueChange={(v) => setOpenColumnId(v)}
                className="space-y-2"
              >
                <SortableList<RoadmapColumn>
                  items={columns}
                  onReorder={handleReorder}
                  className="gap-2"
                  renderItem={(col, colDragHandleRef, colDragHandleProps) => (
                    <RoadmapColumnItem
                      key={col.id}
                      column={col}
                      roadmapId={roadmap.id}
                      dragHandleRef={colDragHandleRef}
                      dragHandleProps={colDragHandleProps}
                      isOpen={openColumnId === col.id}
                      onClose={() => setOpenColumnId("")}
                    />
                  )}
                />
              </Accordion>
            ) : (
              <p className="text-xs text-muted-foreground">No columns yet.</p>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1 h-8 w-full gap-1.5 border-dashed text-xs text-muted-foreground hover:text-foreground"
              onClick={handleAddColumn}
              disabled={addingCol}
            >
              {addingCol ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Add column
            </Button>
          </div>
        </SectionAccordion>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &ldquo;{roadmap.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the roadmap and all its columns. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                del(roadmap.id);
                setConfirmOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
