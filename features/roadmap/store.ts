import { create } from 'zustand';
import type { Roadmap, RoadmapColumn } from './types';

interface RoadmapStore {
  roadmaps:       Roadmap[];
  dialogOpen:     boolean;
  editingRoadmap: Roadmap | null;

  setRoadmaps:              (roadmaps: Roadmap[]) => void;
  openCreateDialog:         () => void;
  openEditDialog:           (roadmap: Roadmap) => void;
  closeDialog:              () => void;
  addRoadmap:               (roadmap: Roadmap) => void;
  patchRoadmap:             (roadmap: Roadmap) => void;
  removeRoadmap:            (id: string) => void;
  reorderRoadmaps:          (roadmaps: Roadmap[]) => void;
  reorderColumnsInRoadmap:  (roadmapId: string, columns: RoadmapColumn[]) => void;
}

export const useRoadmapStore = create<RoadmapStore>((set) => ({
  roadmaps:       [],
  dialogOpen:     false,
  editingRoadmap: null,

  setRoadmaps:      (roadmaps) => set({ roadmaps }),
  openCreateDialog: ()         => set({ dialogOpen: true,  editingRoadmap: null }),
  openEditDialog:   (roadmap)  => set({ dialogOpen: true,  editingRoadmap: roadmap }),
  closeDialog:      ()         => set({ dialogOpen: false, editingRoadmap: null }),
  addRoadmap:       (roadmap)  => set(s => ({ roadmaps: [...s.roadmaps, roadmap] })),
  patchRoadmap:     (roadmap)  => set(s => ({ roadmaps: s.roadmaps.map(r => r.id === roadmap.id ? roadmap : r) })),
  removeRoadmap:    (id)       => set(s => ({ roadmaps: s.roadmaps.filter(r => r.id !== id) })),

  reorderRoadmaps: (roadmaps) => set({ roadmaps }),

  reorderColumnsInRoadmap: (roadmapId, columns) =>
    set(s => ({
      roadmaps: s.roadmaps.map(r =>
        r.id === roadmapId ? { ...r, columns } : r,
      ),
    })),
}));
