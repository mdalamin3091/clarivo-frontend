import { z } from 'zod';

export const columnFormSchema = z.object({
  name:       z.string().min(1, 'Name is required').max(100).trim(),
  color:      z.string(),
  baseFilter: z.string(),
});

export type ColumnFormValues = z.infer<typeof columnFormSchema>;

const roadmapIconSchema = z.object({
  type:  z.enum(['predefined', 'emoji']),
  value: z.string().min(1),
});

export const roadmapFormSchema = z.object({
  name:         z.string().min(1, 'Name is required').max(100).trim(),
  description:  z.string().max(500).trim(),
  icon:         roadmapIconSchema,
  visibility:   z.enum(['everyone', 'teamOnly']),
  baseFilter:   z.string(),
  copiedFromId: z.string().optional(),
});

export type RoadmapFormValues = z.infer<typeof roadmapFormSchema>;
