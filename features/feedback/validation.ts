import { z } from 'zod';

export const drawerFormSchema = z.object({
  title:         z.string().min(1, 'Title is required'),
  description:   z.unknown().optional(),           // JSONContent — not validated structurally
  boardId:       z.string().min(1, 'Board is required'),
  statusId:      z.string().nullable(),
  tagIds:        z.array(z.string()),
  assigneeIds:   z.array(z.string()),
  eta:           z.date().optional(),
  visibility:    z.enum(['public', 'private']),
  enableComment: z.boolean(),
  pinned:        z.boolean(),
});

export type DrawerFormValues = z.infer<typeof drawerFormSchema>;
