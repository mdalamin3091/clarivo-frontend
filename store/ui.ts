import type { ReactNode } from 'react';
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  topbarNode: ReactNode | null;
  setTopbarNode: (node: ReactNode | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  topbarNode: null,
  setTopbarNode: (node) => set({ topbarNode: node }),
}));
