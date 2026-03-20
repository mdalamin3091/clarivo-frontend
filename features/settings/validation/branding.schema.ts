import { z } from 'zod';

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color')
  .nullable();

export const brandingSchema = z.object({
  name:         z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  defaultTheme: z.enum(['system', 'light', 'dark']),
  brandColor:   hexColor,
  darkBgColor:  hexColor,
  logo:         z.string().nullable(),
  socialImage:  z.string().nullable(),
});

export type BrandingFormValues = z.infer<typeof brandingSchema>;
