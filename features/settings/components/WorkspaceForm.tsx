'use client';

import type { FormEvent } from 'react';
import { useActiveOrganization } from '@/lib/auth-client';
import { useUpdateWorkspace } from '../hooks/useUpdateWorkspace';

export function WorkspaceForm() {
  const { data: org }    = useActiveOrganization();
  const { mutate, isPending } = useUpdateWorkspace(org?.id);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd   = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const slug = fd.get('slug') as string;
    if (org?.id) mutate({ name, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground">General</h3>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Workspace name</label>
        <input
          name="name"
          type="text"
          defaultValue={org?.name ?? ''}
          placeholder="My Workspace"
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Slug</label>
        <div className="flex items-center overflow-hidden rounded-lg border bg-background">
          <span className="border-r bg-muted px-3 py-2 text-xs text-muted-foreground">
            clarivo.app/
          </span>
          <input
            name="slug"
            type="text"
            defaultValue={org?.slug ?? ''}
            placeholder="my-workspace"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
