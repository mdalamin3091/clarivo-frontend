import { z } from 'zod';

const moduleIconSchema = z.object({
  type: z.enum(['predefined', 'custom']),
  value: z.string().min(1),
});

export const moduleItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Module name is required').max(50).trim(),
  icon: moduleIconSchema,
  link: z.string().min(1, 'Link is required').max(100).trim(),
});

export const modulesFormSchema = z.object({
  modules: z.array(moduleItemSchema),
});

export type ModuleItemValues = z.infer<typeof moduleItemSchema>;
export type ModulesFormValues = z.infer<typeof modulesFormSchema>;
