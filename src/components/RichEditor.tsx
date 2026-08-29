import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

export interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  height?: number | string;
}

const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  placeholder = "Write something...",
  readOnly = false,
  className,
  height = 220,
}) => {
  const editor = useEditor({
    editable: !readOnly,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "rich-editor-prose",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  const editorHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div className={className}>
      <style>{`
        .rich-editor-prose {
          min-height: ${editorHeight};
          padding: 12px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          color: #111827;
          outline: none;
        }
        .rich-editor-prose:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.25);
        }
        .rich-editor-prose p {
          margin: 0 0 0.5rem;
        }
        .rich-editor-prose ul,
        .rich-editor-prose ol {
          padding-left: 1.25rem;
        }
        .rich-editor-prose blockquote {
          border-left: 3px solid #d1d5db;
          padding-left: 0.75rem;
          color: #4b5563;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichEditor;
