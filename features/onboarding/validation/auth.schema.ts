import { z } from 'zod';

// Both schemas output {name, email, password} so useForm<AuthFormValues> is
// compatible with zodResolver(signInSchema) — name simply has no min constraint
// during sign-in (the field is hidden in the UI anyway).
const base = z.object({
  name: z.string(),
  email: z.string().email('Enter a valid email address'),
  password: z.string(),
});

export const signUpSchema = base.extend({
  name: z.string().min(1, 'Full name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signInSchema = base.extend({
  password: z.string().min(1, 'Password is required'),
});

export type AuthFormValues = z.infer<typeof signUpSchema>;
