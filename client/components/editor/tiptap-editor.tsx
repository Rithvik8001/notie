"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useEffect } from 'react';
import { EditorToolbar } from './editor-toolbar';

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  initialContent?: any;
  onChange?: (content: { json: any; html: string }) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export function TipTapEditor({
  initialContent,
  onChange,
  placeholder = "Press '/' for commands, or start typing...",
  editable = true,
  className = '',
}: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Underline,
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
    ],
    content: initialContent || '',
    editable,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange({
          json: editor.getJSON(),
          html: editor.getHTML(),
        });
      }
    },
  });

  // Update editable state when prop changes
  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  // Update content when initialContent changes
  useEffect(() => {
    if (editor && initialContent && editor.isEmpty) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) {
    return null;
  }

  return (
    <div className={editable ? 'border rounded-lg overflow-hidden' : ''}>
      {editable && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} className={editable ? 'p-4 min-h-[300px]' : ''} />
    </div>
  );
}
