export type RoadmapStatus = 'planned' | 'in-progress' | 'completed';

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}
