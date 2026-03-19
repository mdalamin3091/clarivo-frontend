import { AlertCircle } from 'lucide-react';

interface InviteExpiredCardProps {
  message?: string;
}

export function InviteExpiredCard({ message }: InviteExpiredCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-xl mb-6 mx-auto">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Invitation unavailable</h1>
        <p className="text-gray-500 text-sm">
          {message ?? 'This invitation has expired or is no longer valid.'}
        </p>
      </div>
    </div>
  );
}
