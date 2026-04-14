'use client';

import { Globe, Lock, LayoutGrid, Pin, Link2, Trash2 } from 'lucide-react';
import { Controller, type Control } from 'react-hook-form';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { getAvatarColor, getInitials } from '@/shared/utils/avatar';
import type { FeedbackPost } from '../../types';
import type { DrawerFormValues } from '../../validation';

interface Props {
  post:             FeedbackPost;
  control:          Control<DrawerFormValues>;
  currentBoardName: string | undefined;
  isDeleting:       boolean;
  onCopyLink:       () => void;
  onDelete:         () => void;
}

function ActionButton({
  icon, label, onClick, active,
}: {
  icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-xl border border-border transition-colors',
        active
          ? 'bg-primary/10 border-primary/30 text-primary'
          : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
      )}
    >
      {icon}
    </button>
  );
}

export function DrawerAuthorHeader({
  post, control, currentBoardName, isDeleting, onCopyLink, onDelete,
}: Props) {
  const authorName  = post.author?.user?.name ?? 'Unknown';
  const avatarColor = getAvatarColor(authorName);
  const initials    = getInitials(authorName);

  return (
    <div className="flex flex-col items-center px-6 pt-6 pb-5 text-center">
      {/* Avatar */}
      <div className={cn(
        'flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-sm',
        avatarColor,
      )}>
        {initials}
      </div>

      {/* Title — controlled textarea */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            rows={2}
            placeholder="Post title"
            className="mt-3 w-full resize-none bg-transparent text-center text-lg font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none leading-snug"
          />
        )}
      />

      {/* Meta line */}
      <Controller
        name="visibility"
        control={control}
        render={({ field }) => (
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            {currentBoardName && (
              <>
                <span className="flex items-center gap-1">
                  <LayoutGrid className="h-3 w-3" />
                  {currentBoardName}
                </span>
                <span>·</span>
              </>
            )}
            <span className="flex items-center gap-1">
              {field.value === 'public' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              {field.value === 'public' ? 'Public' : 'Private'}
            </span>
            <span>·</span>
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
          </div>
        )}
      />

      {/* Action buttons */}
      <div className="mt-4 flex items-center gap-2">
        <Controller
          name="pinned"
          control={control}
          render={({ field }) => (
            <ActionButton
              icon={<Pin className="h-4 w-4" />}
              label={field.value ? 'Unpin post' : 'Pin post'}
              active={field.value}
              onClick={() => field.onChange(!field.value)}
            />
          )}
        />
        <ActionButton icon={<Link2 className="h-4 w-4" />} label="Copy link" onClick={onCopyLink} />

        {/* Delete with confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              title="Delete post"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete post?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The post and all its comments will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
