import { create } from 'zustand';
import type { Tag } from './types';

interface TagsStore {
  // ── Server data ──────────────────────────────────────────────────────────
  tags: Tag[];

  // ── Dialog state ─────────────────────────────────────────────────────────
  dialogOpen: boolean;
  editingTag: Tag | null; // null = create mode

  // ── Setters ──────────────────────────────────────────────────────────────
  setTags:          (tags: Tag[]) => void;
  openCreateDialog: () => void;
  openEditDialog:   (tag: Tag) => void;
  closeDialog:      () => void;

  // ── Optimistic mutations ──────────────────────────────────────────────────
  addTag:      (tag: Tag) => void;
  patchTag:    (id: string, updates: Partial<Tag>) => void;
  removeTag:   (id: string) => void;
  reorderTags: (tags: Tag[]) => void;
}

export const useTagsStore = create<TagsStore>((set) => ({
  tags:       [],
  dialogOpen: false,
  editingTag: null,

  setTags: (tags) => set({ tags }),

  openCreateDialog: () => set({ dialogOpen: true,  editingTag: null }),
  openEditDialog:   (tag) => set({ dialogOpen: true, editingTag: tag }),
  closeDialog:      () => set({ dialogOpen: false, editingTag: null }),

  addTag: (tag) =>
    set((state) => ({ tags: [...state.tags, tag] })),

  patchTag: (id, updates) =>
    set((state) => ({
      tags: state.tags.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  removeTag: (id) =>
    set((state) => ({ tags: state.tags.filter((t) => t.id !== id) })),

  reorderTags: (tags) => set({ tags }),
}));
