'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { queryKeys } from '@/lib/query-keys';
import { authClient } from '@/lib/auth-client';

interface Result {
  isChecking: boolean;
  isAvailable: boolean;
  isTaken: boolean;
}

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Debounces the org name, derives a slug, checks availability via
 * better-auth's built-in checkSlug endpoint, and notifies the parent
 * of the result via `onAvailabilityChange`.
 */
export function useCheckOrgName(
  name: string,
  onAvailabilityChange: (available: boolean) => void,
): Result {
  const debouncedName = useDebounce(name.trim(), 600);
  const debouncedSlug = nameToSlug(debouncedName);

  const { data, isFetching, isError } = useQuery({
    queryKey: queryKeys.organizations.checkSlug(debouncedSlug),
    queryFn: async () => {
      const { data: result, error } = await authClient.organization.checkSlug({ slug: debouncedSlug });
      if (error) return { available: false };
      return { available: !!result?.status };
    },
    enabled: debouncedSlug.length >= 2,
    staleTime: 10_000,
  });

  const isChecking =
    isFetching || (debouncedName !== name.trim() && name.trim().length >= 2);
  const isAvailable = !isChecking && data?.available === true && !isError;
  const isTaken = !isChecking && data?.available === false;

  useEffect(() => {
    onAvailabilityChange(isAvailable);
  }, [isAvailable, onAvailabilityChange]);

  return { isChecking, isAvailable, isTaken };
}
