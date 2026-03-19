'use client';

import { useSession } from '@/lib/auth-client';
import { useGetInvitation, InviteAcceptCard, InviteExpiredCard } from '@/features/invite';
import { Spinner } from '@/shared/components/ui/Spinner';

interface InviteClientProps {
  invitationId: string;
}

export function InviteClient({ invitationId }: InviteClientProps) {
  const { data: session, isPending: sessionLoading } = useSession();
  const { data: invitation, isPending: inviteLoading, error } = useGetInvitation(invitationId);

  if (sessionLoading || inviteLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !invitation) {
    return <InviteExpiredCard message={error?.message} />;
  }

  if (invitation.status !== 'pending') {
    const messages: Record<string, string> = {
      accepted: 'This invitation has already been accepted.',
      rejected: 'This invitation has already been declined.',
      canceled: 'This invitation has been cancelled by the sender.',
    };
    return <InviteExpiredCard message={messages[invitation.status]} />;
  }

  const isExpired = new Date(invitation.expiresAt) < new Date();
  if (isExpired) {
    return <InviteExpiredCard message="This invitation has expired." />;
  }

  // Not logged in — redirect to sign-in, then come back
  if (!session) {
    const redirect = encodeURIComponent(`/invite/${invitationId}`);
    window.location.href = `/sign-in?redirect=${redirect}`;
    return null;
  }

  return <InviteAcceptCard invitation={invitation} />;
}
