'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { JSONContent } from 'novel';
import type { FeedbackPost } from '../types';
import { drawerFormSchema, type DrawerFormValues } from '../validation';

function parseDescription(raw: unknown): JSONContent | undefined {
  if (!raw) return undefined;
  try {
    if (typeof raw === 'string') return JSON.parse(raw) as JSONContent;
    if (typeof raw === 'object') return raw as JSONContent;
  } catch {
    // malformed JSON — treat as empty
  }
  return undefined;
}

export function useDrawerForm(post: FeedbackPost | null) {
  const form = useForm<DrawerFormValues>({
    resolver:      zodResolver(drawerFormSchema),
    defaultValues: {
      title:         '',
      description:   undefined,
      boardId:       '',
      statusId:      null,
      tagIds:        [],
      assigneeIds:   [],
      eta:           undefined,
      visibility:    'public',
      enableComment: true,
      pinned:        false,
    },
  });

  // Populate form whenever the active post changes
  useEffect(() => {
    if (!post) return;
    form.reset({
      title:         post.title,
      description:   parseDescription(post.description),
      boardId:       post.boardId,
      statusId:      post.statusId,
      tagIds:        post.tags.map((t) => t.id),
      assigneeIds:   post.assignees.map((a) => a.id),
      eta:           undefined,
      visibility:    post.postVisibility,
      enableComment: post.enableComment,
      pinned:        !!post.pinnedAt,
    });
  }, [post, form]);

  return form;
}
