'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { queryKeys } from '@/lib/query-keys';
import { checkOrgName } from '../api';

interface Result {
  isChecking: boolean;
  isAvailable: boolean;
  isTaken: boolean;
}

/**
 * Debounces the org name, checks availability via the API,
 * and notifies the parent of the result via `onAvailabilityChange`.
 */
export function useCheckOrgName(
  name: string,
  onAvailabilityChange: (available: boolean) => void,
): Result {
  const debouncedName = useDebounce(name.trim(), 600);

  const { data, isFetching, isError } = useQuery({
    queryKey: queryKeys.organizations.checkName(debouncedName),
    queryFn: () => checkOrgName(debouncedName),
    enabled: debouncedName.length >= 2,
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
