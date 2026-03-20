'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandingSchema, type BrandingFormValues } from '../validation/branding.schema';

/**
 * Owns form state and resolver for the branding settings form.
 *
 * SRP  — form initialisation and resolver selection only.
 * SoC  — validation rules live in branding.schema.ts.
 *
 * Initialises with empty defaults; BrandingForm resets via form.reset()
 * once useActiveOrganization() resolves.
 */
export function useBrandingForm() {
  return useForm<BrandingFormValues>({
    // @hookform/resolvers v5 + Zod v4 infers Resolver<FieldValues> instead of
    // Resolver<BrandingFormValues> — known typing gap in the current versions.
    resolver: zodResolver(brandingSchema) as Resolver<BrandingFormValues>,
    defaultValues: {
      displayName:  '',
      defaultTheme: 'system',
      brandColor:   null,
      darkBgColor:  null,
      logo:         null,
      socialImage:  null,
    },
  });
}
