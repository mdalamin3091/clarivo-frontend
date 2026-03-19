'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { signIn, useSession } from '@/lib/auth-client';
import { useAuthForm } from '@/features/onboarding/hooks/useAuthForm';
import { usePostSignInRedirect } from '../hooks/usePostSignInRedirect';
import type { AuthFormValues } from '@/features/onboarding/validation/auth.schema';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { FormInput } from '@/shared/components/ui/FormInput';
import { FormPasswordInput } from '@/shared/components/ui/FormPasswordInput';
import { Logo } from '@/shared/components/Logo';

export function SignInPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { redirect } = usePostSignInRedirect();
  const [serverError, setServerError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useAuthForm('signin');
  const { handleSubmit, formState: { isSubmitting } } = form;

  // Already authenticated → check org count and route accordingly.
  // Skip if we just signed out — session atom clears async so we'd see a stale value.
  useEffect(() => {
    if (isPending || !session) return;
    if (sessionStorage.getItem('just-signed-out')) {
      setTimeout(() => sessionStorage.removeItem('just-signed-out'), 100);
      return;
    }
    redirect();
  }, [session, isPending, redirect]);

  const onSubmit = async (values: AuthFormValues) => {
    setServerError('');
    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
      });
      if (error) throw new Error(error.message ?? 'Sign in failed');
      await redirect();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleGoogle = async () => {
    setServerError('');
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/auth/callback`,
      });
    } catch {
      setServerError('Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-primary/5 via-background to-muted/30 p-4">
      <div className="w-full max-w-md">

        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="rounded-2xl border bg-card shadow-xl">
          <div className="border-b px-8 py-6">
            <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your account to continue.
            </p>
          </div>

          <div className="space-y-5 px-8 py-6">
            {/* Google OAuth */}
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-xl border-border/60 text-sm font-medium hover:border-border"
              onClick={handleGoogle}
              disabled={googleLoading || isSubmitting}
            >
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            {/* Email / password */}
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                  control={form.control}
                  name="email"
                  label="Email address"
                  inputProps={{
                    type: 'email',
                    placeholder: 'jane@company.com',
                    autoComplete: 'email',
                  }}
                />

                <FormPasswordInput
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Your password"
                  autoComplete="current-password"
                />

                {serverError && (
                  <p className="animate-fade-in rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {serverError}
                  </p>
                )}

                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl text-sm font-semibold"
                  disabled={isSubmitting || googleLoading}
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Sign in
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/onboarding')}
            className="font-semibold text-primary hover:text-primary/80"
          >
            Create one for free
          </button>
        </p>

      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
