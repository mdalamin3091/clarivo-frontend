import { Suspense } from 'react';
import { Spinner } from '@/shared/components/ui/Spinner';
import { InviteClient } from './_components/InviteClient';

interface InvitePageProps {
  params: Promise<{ invitationId: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { invitationId } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <InviteClient invitationId={invitationId} />
    </Suspense>
  );
}
