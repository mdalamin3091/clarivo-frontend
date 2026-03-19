'use client';

import { Building2, UserCheck } from 'lucide-react';
import type { Invitation } from '../types';
import { useAcceptInvite } from '../hooks/useAcceptInvite';

interface InviteAcceptCardProps {
  invitation: Invitation;
}

export function InviteAcceptCard({ invitation }: InviteAcceptCardProps) {
  const { accept, reject } = useAcceptInvite();

  const capitalizedRole =
    invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1);

  const isLoading = accept.isPending || reject.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-md w-full">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-6">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Join {invitation.organization.name}
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          <span className="font-medium text-gray-700">{invitation.inviter.name}</span> has
          invited you to join{' '}
          <span className="font-medium text-gray-700">{invitation.organization.name}</span> as
          a{' '}
          <span className="inline-flex items-center gap-1 font-medium text-gray-700">
            <UserCheck className="w-3.5 h-3.5" />
            {capitalizedRole}
          </span>
          .
        </p>

        {(accept.isError || reject.isError) && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
            {(accept.error ?? reject.error)?.message}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => reject.mutate(invitation.id)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={() => accept.mutate(invitation.id)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {accept.isPending ? 'Accepting...' : 'Accept Invitation'}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Expires{' '}
          {new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(
            new Date(invitation.expiresAt),
          )}
        </p>
      </div>
    </div>
  );
}
