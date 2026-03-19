import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from '@tanstack/react-query';

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30 * 1000, retry: 1 },
      dehydrate: {
        // stream pending queries to the client without awaiting (v5.40.0+)
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        // required so Next.js can detect dynamic pages via thrown errors
        shouldRedactErrors: () => false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Single factory used by both server and client.
 * - Server: always creates a fresh instance (one per request, no cross-request leak)
 * - Browser: returns a stable singleton (survives React Suspense re-renders)
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
