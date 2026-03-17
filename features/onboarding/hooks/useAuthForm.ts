import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, signInSchema, type AuthFormValues } from '../validation/auth.schema';

const DEFAULT_VALUES: AuthFormValues = { name: '', email: '', password: '' };

/**
 * Manages form state for both signup and signin modes.
 *
 * SRP  — owns form state, resolver selection, and reset logic only.
 * SoC  — delegates validation rules to auth.schema.ts.
 * DRY  — single hook consumed by StepAuth; mode switching handled internally.
 */
export function useAuthForm(mode: 'signup' | 'signin') {
  const form = useForm<AuthFormValues>({
    // @hookform/resolvers v5 + Zod v4 infers Resolver<FieldValues> instead of
    // Resolver<AuthFormValues> — known typing gap in the current versions.
    // The cast is safe: both schemas output {name, email, password}.
    // react-hook-form stores options in an internal ref that's updated each
    // render, so the correct schema is always used on the next validation call.
    resolver: zodResolver(
      mode === 'signup' ? signUpSchema : signInSchema,
    ) as Resolver<AuthFormValues>,
    defaultValues: DEFAULT_VALUES,
  });

  // Clear stale field values and errors when the user switches modes
  useEffect(() => {
    form.reset(DEFAULT_VALUES);
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  return form;
}
