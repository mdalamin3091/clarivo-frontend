'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { acceptInvitation, rejectInvitation } from '../api';

export function useAcceptInvite() {
  const router = useRouter();

  const accept = useMutation({
    mutationFn: (invitationId: string) => acceptInvitation(invitationId),
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  const reject = useMutation({
    mutationFn: (invitationId: string) => rejectInvitation(invitationId),
    onSuccess: () => {
      router.push('/');
    },
  });

  return { accept, reject };
}
