import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [organizationClient()],
});

export const {
  useSession,
  useListOrganizations,
  useActiveOrganization,
  signIn,
  signUp,
  signOut,
} = authClient;
