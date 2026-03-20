'use client';

import React, { type ChangeEvent, useRef, useState } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { useActiveOrganization } from '@/lib/auth-client';
import { useUpdateBranding } from '../hooks/useUpdateBranding';
import type { BrandingData, BrandingFormData } from '../types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function toHex(val: string | null | undefined): string {
  return val ?? '#000000';
}

function isValidHex(val: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(val);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── ColorField ────────────────────────────────────────────────────────────────

interface ColorFieldProps {
  label: string;
  description?: string;
  value: string;
  onChange: (val: string) => void;
}

function ColorField({ label, description, value, onChange }: ColorFieldProps) {
  const [hex, setHex] = useState(value);

  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHex(raw);
    if (isValidHex(raw)) onChange(raw);
  };

  const handlePickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHex(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <div className="flex items-center gap-2">
        <label className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-full border">
          <span
            className="block h-full w-full rounded-full"
            style={{ background: isValidHex(hex) ? hex : '#000000' }}
          />
          <input
            type="color"
            value={isValidHex(hex) ? hex : '#000000'}
            onChange={handlePickerChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <input
          type="text"
          value={hex}
          onChange={handleHexChange}
          maxLength={7}
          placeholder="#000000"
          className="flex-1 rounded-lg border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
    </div>
  );
}

// ── BrandingForm (inner) ──────────────────────────────────────────────────────
// Receives branding as props so all state is initialized without useEffect.

interface BrandingFormProps {
  branding: BrandingData;
  onRefetch: () => void;
}

function BrandingForm({ branding, onRefetch }: BrandingFormProps) {
  const { mutate, isPending, isError, error, isSuccess } = useUpdateBranding({ onSuccess: onRefetch });

  const [name, setName]               = useState(branding.name ?? '');
  const [defaultTheme, setDefaultTheme] = useState<'system' | 'light' | 'dark'>(
    (branding.defaultTheme as 'system' | 'light' | 'dark') ?? 'system',
  );
  const [brandColor, setBrandColor]   = useState(toHex(branding.brandColor));
  const [darkBgColor, setDarkBgColor] = useState(toHex(branding.darkBgColor));
  const [logoPreview, setLogoPreview]     = useState<string | null>(branding.logo ?? null);
  const [logoFileName, setLogoFileName]   = useState('No file chosen');
  const [socialPreview, setSocialPreview] = useState<string | null>(branding.socialImage ?? null);

  const logoInputRef   = useRef<HTMLInputElement>(null);
  const socialInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFileName(file.name);
    const dataUrl = await fileToDataUrl(file);
    setLogoPreview(dataUrl);
  };

  const handleSocialChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setSocialPreview(dataUrl);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: BrandingFormData = {
      name:         name.trim() || undefined,
      defaultTheme,
      brandColor:   isValidHex(brandColor) ? brandColor : null,
      darkBgColor:  isValidHex(darkBgColor) ? darkBgColor : null,
      logo:         logoPreview ?? null,
      socialImage:  socialPreview ?? null,
    };
    mutate(payload);
  };

  const orgInitial = (branding.name ?? '?').charAt(0).toUpperCase();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-card p-6">

      {/* Row 1: Name + Default theme */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Organization name"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Default theme</label>
          <select
            value={defaultTheme}
            onChange={(e) => setDefaultTheme(e.target.value as 'system' | 'light' | 'dark')}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="system">System default option</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      {/* Row 2: Logo + Brand Color */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Logo</label>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
              ) : (
                orgInitial
              )}
            </div>
            <label className="cursor-pointer rounded-lg border bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/80">
              Choose File
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </label>
            <span className="truncate text-xs text-muted-foreground">{logoFileName}</span>
          </div>
        </div>

        <ColorField
          label="Brand Color"
          value={brandColor}
          onChange={setBrandColor}
        />
      </div>

      {/* Row 3: Social Image + Custom Theme Options */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Featured Image for Social Media
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 py-6 transition-colors hover:bg-muted/50">
            {socialPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={socialPreview}
                alt="Social preview"
                className="max-h-24 rounded object-contain"
              />
            ) : (
              <>
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add featured image</span>
              </>
            )}
            <input
              ref={socialInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSocialChange}
            />
          </label>
        </div>

        <div className="space-y-4">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">Custom theme options</p>
            <p className="text-xs text-muted-foreground">
              Change the background color of your Clarivo web portal and widgets to match your brand.
            </p>
          </div>
          <ColorField
            label="Background color (For dark mode)"
            value={darkBgColor}
            onChange={setDarkBgColor}
          />
        </div>
      </div>

      {/* Row 4: Organization subdomain */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Organization subdomain</label>
        <div className="flex items-center overflow-hidden rounded-lg border bg-background">
          <input
            type="text"
            defaultValue={branding.slug}
            readOnly
            className="flex-1 bg-transparent px-3 py-2 text-sm text-muted-foreground focus:outline-none"
          />
          <span className="border-l bg-muted px-3 py-2 text-xs text-muted-foreground">
            .clarivo.app
          </span>
        </div>
      </div>

      {/* Feedback */}
      {isError && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {(error as Error)?.message ?? 'Failed to save branding'}
        </p>
      )}
      {isSuccess && (
        <p className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-600 dark:text-green-400">
          Branding saved successfully.
        </p>
      )}

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {isPending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

// ── BrandingPage (outer) ──────────────────────────────────────────────────────

export function BrandingPage() {
  const { data: org, isPending, refetch } = useActiveOrganization();

  if (isPending) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const extra = org as unknown as Record<string, string | null | undefined>;
  const branding: BrandingData | null = org
    ? {
        id:           org.id,
        name:         org.name,
        slug:         org.slug,
        logo:         org.logo ?? null,
        brandColor:   extra.brandColor ?? null,
        darkBgColor:  extra.darkBgColor ?? null,
        defaultTheme: extra.defaultTheme ?? null,
        socialImage:  extra.socialImage ?? null,
      }
    : null;

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Branding</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage the branding for your organization, including name, logo, and appearance settings.
        </p>
      </div>

      {branding && (
        <BrandingForm key={branding.id} branding={branding} onRefetch={() => refetch()} />
      )}
    </div>
  );
}
