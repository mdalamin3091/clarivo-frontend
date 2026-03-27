'use client';

import { create } from 'zustand';

interface FeedbackStore {
  // Create modal
  isOpen: boolean;
  open: () => void;
  close: () => void;

  // Edit drawer
  drawerOpen: boolean;
  drawerPostId: string | null;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
}

export const useFeedbackModalStore = create<FeedbackStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  drawerOpen: false,
  drawerPostId: null,
  openDrawer: (id) => set({ drawerOpen: true, drawerPostId: id }),
  closeDrawer: () => set({ drawerOpen: false, drawerPostId: null }),
}));
