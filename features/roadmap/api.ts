import { apiFetch } from '@/lib/api';
import type { Roadmap, CreateRoadmapInput, UpdateRoadmapInput, UpdateRoadmapColumnInput, ReorderColumnsInput, ReorderRoadmapsInput } from './types';

export async function fetchRoadmaps(): Promise<Roadmap[]> {
  const data = await apiFetch<{ roadmaps: Roadmap[] }>('/api/v1/roadmaps');
  return data.roadmaps;
}

export async function fetchRoadmap(id: string): Promise<Roadmap> {
  const data = await apiFetch<{ roadmap: Roadmap }>(`/api/v1/roadmaps/${id}`);
  return data.roadmap;
}

export async function createRoadmap(input: CreateRoadmapInput): Promise<Roadmap> {
  const data = await apiFetch<{ roadmap: Roadmap }>('/api/v1/roadmaps', {
    method: 'POST',
    body:   JSON.stringify(input),
  });
  return data.roadmap;
}

export async function updateRoadmap(id: string, input: UpdateRoadmapInput): Promise<Roadmap> {
  const data = await apiFetch<{ roadmap: Roadmap }>(`/api/v1/roadmaps/${id}`, {
    method: 'PATCH',
    body:   JSON.stringify(input),
  });
  return data.roadmap;
}

export async function deleteRoadmap(id: string): Promise<void> {
  await apiFetch(`/api/v1/roadmaps/${id}`, { method: 'DELETE' });
}

export async function reorderRoadmaps(input: ReorderRoadmapsInput): Promise<Roadmap[]> {
  const data = await apiFetch<{ roadmaps: Roadmap[] }>('/api/v1/roadmaps/reorder', {
    method: 'PATCH',
    body:   JSON.stringify(input),
  });
  return data.roadmaps;
}

// ── Column API ─────────────────────────────────────────────────────────────────

export async function createRoadmapColumn(roadmapId: string): Promise<Roadmap> {
  const data = await apiFetch<{ roadmap: Roadmap }>(`/api/v1/roadmaps/${roadmapId}/columns`, {
    method: 'POST',
  });
  return data.roadmap;
}

export async function updateRoadmapColumn(
  roadmapId: string,
  columnId:  string,
  input:     UpdateRoadmapColumnInput,
): Promise<Roadmap> {
  const data = await apiFetch<{ roadmap: Roadmap }>(`/api/v1/roadmaps/${roadmapId}/columns/${columnId}`, {
    method: 'PATCH',
    body:   JSON.stringify(input),
  });
  return data.roadmap;
}

export async function deleteRoadmapColumn(roadmapId: string, columnId: string): Promise<Roadmap> {
  const data = await apiFetch<{ roadmap: Roadmap }>(`/api/v1/roadmaps/${roadmapId}/columns/${columnId}`, {
    method: 'DELETE',
  });
  return data.roadmap;
}

export async function reorderRoadmapColumns(
  roadmapId: string,
  input:     ReorderColumnsInput,
): Promise<Roadmap> {
  const data = await apiFetch<{ roadmap: Roadmap }>(`/api/v1/roadmaps/${roadmapId}/columns/reorder`, {
    method: 'PATCH',
    body:   JSON.stringify(input),
  });
  return data.roadmap;
}
