import { authClient } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import type { Board, BoardGreeting, BoardSorting, CreateBoardInput, UpdateBoardInput } from './types';

export async function fetchBoards(): Promise<Board[]> {
  const data = await apiFetch<{ boards: Board[] }>('/api/v1/boards');
  return data.boards;
}

export async function fetchBoard(id: string): Promise<Board> {
  const data = await apiFetch<{ board: Board }>(`/api/v1/boards/${id}`);
  return data.board;
}

export async function createBoard(input: CreateBoardInput): Promise<Board> {
  const data = await apiFetch<{ board: Board }>('/api/v1/boards', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.board;
}

export async function updateBoard(id: string, input: UpdateBoardInput): Promise<Board> {
  const data = await apiFetch<{ board: Board }>(`/api/v1/boards/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  return data.board;
}

export async function deleteBoard(id: string): Promise<void> {
  await apiFetch(`/api/v1/boards/${id}`, { method: 'DELETE' });
}

// ── Org-level board settings — updated via Better Auth organization update ──
// Data is read via useActiveOrganization() (better-auth get-full-organization).

// authClient.organization.update() data type only includes standard BA fields.
// hideLeaderBoard, defaultSorting, boardGreeting are additionalFields — cast bridges the gap.
type OrgUpdateData = Parameters<typeof authClient.organization.update>[0]['data'];

export interface UpdateBoardGlobalInput {
  hideLeaderBoard?: boolean;
  defaultSorting?:  BoardSorting;
  boardGreeting?:   BoardGreeting | null;
}

export async function updateBoardGlobalSettings(
  organizationId: string,
  input: UpdateBoardGlobalInput,
): Promise<void> {
  const { error } = await authClient.organization.update({
    data: input as unknown as OrgUpdateData,
    organizationId,
  });
  if (error) throw new Error(error.message);
}
