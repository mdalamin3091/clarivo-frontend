'use client';

import { type ChangeEvent, useEffect, useRef } from 'react';
import { useWatch } from 'react-hook-form';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { useActiveOrganization } from '@/lib/auth-client';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/shared/components/ui/FormInput';
import { FormSelect } from '@/shared/components/ui/FormSelect';
import { ColorField } from './ColorField';
import { useBrandingForm } from '../hooks/useBrandingForm';
import { useUpdateBranding } from '../hooks/useUpdateBranding';
import { fileToDataUrl } from '../utils/branding';
import type { BrandingFormValues } from '../validation/branding.schema';

/**
 * Branding settings form.
 *
 * SRP  — renders the branding form UI only; delegates every other concern.
 * SoC  — form state → useBrandingForm, validation → branding.schema,
 *         server sync → useUpdateBranding, colour utils → utils/branding.
 * DRY  — ColorField, FormInput re-used for all labelled inputs.
 *
 * Async data pattern: form.reset() fires in useEffect when org loads;
 * ColorField instances receive key={org?.id} so they remount and re-initialise
 * their internal draft state from the fresh field value — no setState-in-effect.
 */
export function BrandingForm() {
  const { data: org, refetch }  = useActiveOrganization();
  const form                    = useBrandingForm();
  const { mutate, isPending }   = useUpdateBranding(() => refetch());

  const logoInputRef   = useRef<HTMLInputElement>(null);
  const socialInputRef = useRef<HTMLInputElement>(null);

  const logoValue   = useWatch({ control: form.control, name: 'logo' });
  const socialValue = useWatch({ control: form.control, name: 'socialImage' });

  // Populate form once org data resolves, or when the active org switches.
  useEffect(() => {
    if (!org) return;
    const extra = org as unknown as Record<string, string | null | undefined>;
    form.reset({
      displayName:  extra.displayName ?? org.name,
      defaultTheme: (extra.defaultTheme as BrandingFormValues['defaultTheme']) ?? 'system',
      brandColor:   extra.brandColor  ?? null,
      darkBgColor:  extra.darkBgColor ?? null,
      logo:         org.logo          ?? null,
      socialImage:  extra.socialImage ?? null,
    });
  }, [org?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    form.setValue('logo', await fileToDataUrl(file), { shouldDirty: true });
  };

  const handleSocialChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    form.setValue('socialImage', await fileToDataUrl(file), { shouldDirty: true });
  };

  const onSubmit = (values: BrandingFormValues) => mutate(values);

  const orgInitial = (org?.name ?? '?').charAt(0).toUpperCase();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rounded-xl border bg-card p-6">

        {/* ── Row 1: Name + Default theme ──────────────────────────────── */}
        <div className="grid grid-cols-2 gap-6">
          <FormInput
            control={form.control}
            name="displayName"
            label="Display Name"
            inputProps={{ placeholder: 'Display name' }}
            inputClassName="h-9 rounded-lg"
          />

          <FormSelect
            control={form.control}
            name="defaultTheme"
            label="Default theme"
            placeholder="Select theme"
            options={[
              { value: 'system', label: 'System default' },
              { value: 'light',  label: 'Light' },
              { value: 'dark',   label: 'Dark' },
            ]}
          />
        </div>

        {/* ── Row 2: Logo + Brand colour ───────────────────────────────── */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Logo</Label>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {logoValue ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoValue} alt="Logo preview" className="h-full w-full object-cover" />
                ) : (
                  orgInitial
                )}
              </div>
              <Label className="cursor-pointer rounded-lg border bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/80">
                Choose File
                <Input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </Label>
            </div>
          </div>

          <FormField
            control={form.control}
            name="brandColor"
            render={({ field }) => (
              <FormItem>
                {/* key remounts ColorField when org loads so useState
                    re-initialises from the fresh field value — no useEffect needed */}
                <ColorField
                  key={org?.id ?? 'unset'}
                  label="Brand Color"
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── Row 3: Social image + Dark background colour ─────────────── */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Featured Image for Social Media
            </Label>
            <Label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 py-6 transition-colors hover:bg-muted/50">
              {socialValue ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={socialValue}
                  alt="Social preview"
                  className="max-h-24 rounded object-contain"
                />
              ) : (
                <>
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add featured image</span>
                </>
              )}
              <Input
                ref={socialInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSocialChange}
              />
            </Label>
          </div>

          <div className="space-y-4">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground">Custom theme options</p>
              <p className="text-xs text-muted-foreground">
                Change the background colour of your Clarivo portal and widgets to match your brand.
              </p>
            </div>
            <FormField
              control={form.control}
              name="darkBgColor"
              render={({ field }) => (
                <FormItem>
                  <ColorField
                    key={org?.id ?? 'unset'}
                    label="Background color (For dark mode)"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ── Row 4: Organization subdomain (read-only) ────────────────── */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Organization subdomain
          </Label>
          <div className="flex items-center overflow-hidden rounded-md border">
            <Input
              defaultValue={org?.slug ?? ''}
              readOnly
              className="flex-1 rounded-none border-0 text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <span className="border-l bg-muted px-3 py-2 text-xs text-muted-foreground">
              .clarivo.app
            </span>
          </div>
        </div>

        {/* ── Save ─────────────────────────────────────────────────────── */}
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            {isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
