import { create } from 'zustand';
import type { Status } from './types';

interface StatusesStore {
  // ── Server data ──────────────────────────────────────────────────────────
  statuses: Status[];

  // ── Dialog state ─────────────────────────────────────────────────────────
  dialogOpen:    boolean;
  editingStatus: Status | null; // null = create mode

  // ── Setters ──────────────────────────────────────────────────────────────
  setStatuses:      (statuses: Status[]) => void;
  openCreateDialog: () => void;
  openEditDialog:   (status: Status) => void;
  closeDialog:      () => void;

  // ── Optimistic mutations ──────────────────────────────────────────────────
  addStatus:       (status: Status) => void;
  patchStatus:     (id: string, updates: Partial<Status>) => void;
  removeStatus:    (id: string) => void;
  setDefaultStatus:(id: string) => void;
  reorderStatuses: (statuses: Status[]) => void;
}

export const useStatusesStore = create<StatusesStore>((set) => ({
  statuses:      [],
  dialogOpen:    false,
  editingStatus: null,

  setStatuses: (statuses) => set({ statuses }),

  openCreateDialog: () => set({ dialogOpen: true,  editingStatus: null }),
  openEditDialog:   (status) => set({ dialogOpen: true, editingStatus: status }),
  closeDialog:      () => set({ dialogOpen: false, editingStatus: null }),

  addStatus: (status) =>
    set((state) => ({ statuses: [...state.statuses, status] })),

  patchStatus: (id, updates) =>
    set((state) => ({
      statuses: state.statuses.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  removeStatus: (id) =>
    set((state) => ({ statuses: state.statuses.filter((s) => s.id !== id) })),

  // Clears all defaults, then marks the target as default — no flicker
  setDefaultStatus: (id) =>
    set((state) => ({
      statuses: state.statuses.map((s) => ({ ...s, isDefault: s.id === id })),
    })),

  reorderStatuses: (statuses) => set({ statuses }),
}));
