import { useMutation } from '@tanstack/react-query';
import { setupOrganization } from '../api';
import type { OnboardingData, CreatedOrganization } from '../types';

interface Options {
  onSuccess?: (result: CreatedOrganization) => void;
  onError?: (error: Error) => void;
}

export function useSetupOrg({ onSuccess, onError }: Options = {}) {
  return useMutation({
    mutationFn: (data: OnboardingData) =>
      setupOrganization({
        name: data.orgName,
        modules: data.modules,
        accessibility: data.accessibility as 'public' | 'private',
        teamSize: data.teamSize,
      }),
    onSuccess,
    onError,
  });
}
