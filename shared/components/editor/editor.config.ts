import {
  StarterKit,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  CodeBlockLowlight,
  Youtube,
  HorizontalRule,
  Placeholder,
  HighlightExtension,
  GlobalDragHandle,
  Command,
  createSuggestionItems,
  renderItems,
} from 'novel';
import TextAlign from '@tiptap/extension-text-align';
import { common, createLowlight } from 'lowlight';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Image,
  Minus,
  Youtube as YoutubeIcon,
} from 'lucide-react';
import { createElement } from 'react';
import { toast } from 'sonner';
import { uploadEditorImage } from './utils/uploadAsset';

const lowlight = createLowlight(common);

// ─── Tiptap Extensions ────────────────────────────────────────────────────────

export function buildExtensions(placeholder: string) {
  return [
    StarterKit.configure({
      bulletList: { HTMLAttributes: { class: 'list-disc list-outside leading-3 -mt-2' } },
      orderedList: { HTMLAttributes: { class: 'list-decimal list-outside leading-3 -mt-2' } },
      listItem: { HTMLAttributes: { class: 'leading-normal -mb-2' } },
      blockquote: { HTMLAttributes: { class: 'border-l-4 border-border' } },
      codeBlock: false, // replaced by CodeBlockLowlight
      code: { HTMLAttributes: { class: 'rounded-md bg-muted px-1.5 py-1 font-mono font-medium' } },
      horizontalRule: false, // replaced by HorizontalRule
      dropcursor: { color: '#DBEAFE', width: 4 },
    }),
    Placeholder.configure({ placeholder, showOnlyCurrent: false, includeChildren: false }),
    TiptapImage.configure({ allowBase64: true }),
    TiptapLink.configure({
      HTMLAttributes: { class: 'text-primary underline underline-offset-2 cursor-pointer' },
    }),
    TiptapUnderline,
    HighlightExtension.configure({ multicolor: true }),
    CodeBlockLowlight.configure({ lowlight }),
    HorizontalRule,
    Youtube.configure({ nocookie: true, HTMLAttributes: { class: 'rounded-lg w-full' } }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    GlobalDragHandle,
    Command.configure({
      suggestion: {
        render: renderItems,
      },
    }),
  ];
}

// Helper to create icon elements without JSX in a .ts file
function icon(Component: React.ElementType) {
  return createElement(Component, { className: 'h-4 w-4' });
}

// ─── Slash Command Items ──────────────────────────────────────────────────────

export const SLASH_COMMAND_ITEMS = createSuggestionItems([
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: icon(Heading1),
    searchTerms: ['title', 'big', 'large', 'h1'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: icon(Heading2),
    searchTerms: ['subtitle', 'medium', 'h2'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: icon(Heading3),
    searchTerms: ['subtitle', 'small', 'h3'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list',
    icon: icon(List),
    searchTerms: ['unordered', 'point', 'ul'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: icon(ListOrdered),
    searchTerms: ['ordered', 'ol', 'number'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Regular Code-Block',
    description: 'Syntax-highlighted code block',
    icon: icon(Code),
    searchTerms: ['codeblock', 'pre', 'syntax'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: 'Image or Video',
    description: 'Upload an image or video',
    icon: icon(Image),
    searchTerms: ['photo', 'picture', 'media', 'video'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        try {
          const src = await uploadEditorImage(file);
          editor.chain().focus().setImage({ src }).run();
        } catch {
          toast.error('Failed to upload image. Please try again.');
        }
      };
      input.click();
    },
  },
  {
    title: 'Horizontal Rule',
    description: 'Insert a divider line',
    icon: icon(Minus),
    searchTerms: ['divider', 'line', 'hr', 'rule'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: 'Youtube',
    description: 'Embed a YouTube video',
    icon: icon(YoutubeIcon),
    searchTerms: ['video', 'embed', 'yt'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const url = window.prompt('Enter YouTube URL');
      if (url) {
        editor.commands.setYoutubeVideo({ src: url });
      }
    },
  },
]);

export { renderItems };
