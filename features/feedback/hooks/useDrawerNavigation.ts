'use client';

import { useActiveOrganization } from '@/lib/auth-client';
import { useFeedbackModalStore } from '../store';
import { useFeedbackPosts } from './useFeedbackPosts';

export function useDrawerNavigation() {
  const { data: org }                      = useActiveOrganization();
  const { data: posts = [] }               = useFeedbackPosts(org?.id);
  const { drawerPostId, openDrawer }       = useFeedbackModalStore();

  const currentIndex = posts.findIndex((p) => p.id === drawerPostId);
  const prevPost     = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost     = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return {
    currentIndex,
    total:   posts.length,
    prevPost,
    nextPost,
    goPrev: () => prevPost && openDrawer(prevPost.id),
    goNext: () => nextPost && openDrawer(nextPost.id),
  };
}
