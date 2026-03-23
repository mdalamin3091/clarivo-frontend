import { z } from 'zod';
import { FIELD_TYPE_VALUES, OPTION_TYPES } from './constants';

export const customFieldFormSchema = z
  .object({
    name:                 z.string().min(1, 'Name is required').max(100).trim(),
    type:                 z.enum(FIELD_TYPE_VALUES),
    options:              z.array(z.string().min(1)),
    placeholder:          z.string().max(200),
    isRequired:           z.boolean(),
    isPrivate:            z.boolean(),
    showAnswerToEveryone: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (OPTION_TYPES.has(data.type) && data.options.length === 0) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ['options'],
        message: 'At least one option is required',
      });
    }
  });

export type CustomFieldFormValues = z.infer<typeof customFieldFormSchema>;
