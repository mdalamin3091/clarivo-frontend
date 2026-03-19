import { authClient } from '@/lib/auth-client';
import type { Invitation } from './types';

export async function getInvitation(invitationId: string): Promise<Invitation> {
  const result = await authClient.organization.getInvitation({
    query: { id: invitationId },
  });

  if (result.error) {
    throw new Error(result.error.message ?? 'Invitation not found');
  }

  return result.data as unknown as Invitation;
}

export async function acceptInvitation(invitationId: string): Promise<void> {
  const result = await authClient.organization.acceptInvitation({
    invitationId,
  });

  if (result.error) {
    throw new Error(result.error.message ?? 'Failed to accept invitation');
  }
}

export async function rejectInvitation(invitationId: string): Promise<void> {
  const result = await authClient.organization.rejectInvitation({
    invitationId,
  });

  if (result.error) {
    throw new Error(result.error.message ?? 'Failed to decline invitation');
  }
}