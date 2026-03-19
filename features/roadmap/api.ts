import { apiFetch } from '@/lib/api';
import type { RoadmapItem } from './types';

export async function getRoadmapItems(orgId: string, init?: RequestInit): Promise<RoadmapItem[]> {
  return apiFetch<RoadmapItem[]>(`/api/v1/organizations/${orgId}/roadmap`, init);
}

export async function createRoadmapItem(
  orgId: string,
  data: Pick<RoadmapItem, 'title' | 'description' | 'status'>,
): Promise<RoadmapItem> {
  return apiFetch<RoadmapItem>(`/api/v1/organizations/${orgId}/roadmap`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
