import type { JSONContent, EditorInstance } from 'novel';

export interface RichEditorProps {
  value?: JSONContent;
  onChange?: (value: JSONContent) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
  onAttach?: (file: File) => void;
  onImageInsert?: (file: File) => void;
}

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
  command: (params: { editor: EditorInstance; range: { from: number; to: number } }) => void;
}
