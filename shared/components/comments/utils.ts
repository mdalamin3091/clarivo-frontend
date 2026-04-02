import type { CommentData } from './types';

/** Recursively remove a comment (or reply) by id from the tree. */
export function removeCommentFromTree(comments: CommentData[], id: string): CommentData[] {
  return comments
    .filter((c) => c.id !== id)
    .map((c) => ({ ...c, replies: removeCommentFromTree(c.replies, id) }));
}

/** Recursively apply an updater to a comment by id. */
export function updateCommentInTree(
  comments: CommentData[],
  id:       string,
  updater:  (c: CommentData) => CommentData,
): CommentData[] {
  return comments.map((c) => {
    if (c.id === id) return updater(c);
    return { ...c, replies: updateCommentInTree(c.replies, id, updater) };
  });
}

/** Append a reply to the correct parent anywhere in the tree. */
export function addReplyToTree(
  comments:  CommentData[],
  parentId:  string,
  newReply:  CommentData,
): CommentData[] {
  return comments.map((c) => {
    if (c.id === parentId) return { ...c, replies: [...c.replies, newReply] };
    return { ...c, replies: addReplyToTree(c.replies, parentId, newReply) };
  });
}
