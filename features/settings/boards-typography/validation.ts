import { z } from 'zod';

export const boardFormSchema = z.object({
  name:                     z.string().min(1, 'Board name is required').max(100).trim(),
  iconValue:                z.string().min(1),
  visibility:               z.enum(['public', 'private']),
  defaultSorting:           z.enum(['trending', 'recent', 'oldest', 'top']),
  allowSubscribe:           z.boolean(),
  disableFollowupQuestions: z.boolean(),
  disableEndUserPosting:    z.boolean(),
  welcomingTitle:           z.string().max(200),
  welcomingDescription:     z.string().max(500),
  postCreationButtonText:   z.string().max(50),
  customFieldIds:           z.array(z.string()),
});

export type BoardFormValues = z.infer<typeof boardFormSchema>;
