'use client';

import { create } from 'zustand';
import type { CustomField } from './types';

interface CustomFieldsStore {
  fields:       CustomField[];
  dialogOpen:   boolean;
  editingField: CustomField | null;

  setFields:        (fields: CustomField[]) => void;
  openCreateDialog: () => void;
  openEditDialog:   (field: CustomField) => void;
  closeDialog:      () => void;

  addField:    (field: CustomField) => void;
  patchField:  (id: string, patch: Partial<CustomField>) => void;
  removeField: (id: string) => void;
  reorderFields: (fields: CustomField[]) => void;
}

export const useCustomFieldsStore = create<CustomFieldsStore>((set) => ({
  fields:       [],
  dialogOpen:   false,
  editingField: null,

  setFields:        (fields) => set({ fields }),
  openCreateDialog: ()       => set({ dialogOpen: true, editingField: null }),
  openEditDialog:   (field)  => set({ dialogOpen: true, editingField: field }),
  closeDialog:      ()       => set({ dialogOpen: false, editingField: null }),

  addField:    (field)     => set((s) => ({ fields: [...s.fields, field] })),
  patchField:  (id, patch) => set((s) => ({
    fields: s.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
  })),
  removeField: (id)        => set((s) => ({ fields: s.fields.filter((f) => f.id !== id) })),
  reorderFields: (fields)  => set({ fields }),
}));
