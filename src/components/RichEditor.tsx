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

  const toolbarButtons = editor
    ? [
        { label: "Bold", action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive("bold") },
        { label: "Italic", action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive("italic") },
        { label: "Bullet List", action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive("bulletList") },
        { label: "Ordered List", action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive("orderedList") },
      ]
    : [];

  return (
    <div className={className}>
      <style>{`
        .rich-editor-shell {
          border: 1px solid #d5d7db;
          border-radius: 18px;
          overflow: hidden;
          background: #f3f4f6;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
        }
        .rich-editor-topbar {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 20px 12px;
        }
        .rich-editor-tabs {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.04);
          border: 1px solid rgba(15, 23, 42, 0.08);
        }
        .rich-editor-tab {
          border: none;
          background: transparent;
          color: rgba(15, 23, 42, 0.7);
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }
        .rich-editor-tab.is-active {
          background: rgba(255,255,255,0.8);
          color: #111827;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
        }
        .rich-editor-toolbar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255,255,255,0.65);
        }
        .rich-editor-toolbar button {
          border: none;
          background: transparent;
          color: #374151;
          border-radius: 6px;
          min-width: 26px;
          height: 26px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .rich-editor-toolbar button:hover:not(:disabled) {
          background: rgba(15, 23, 42, 0.04);
        }
        .rich-editor-toolbar button.is-active {
          background: rgba(59, 130, 246, 0.12);
          color: #1d4ed8;
        }
        .rich-editor-toolbar button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .rich-editor-toolbar .toolbar-spacer {
          width: 1px;
          height: 20px;
          background: rgba(15, 23, 42, 0.12);
          margin: 0 4px;
        }
        .rich-editor-toolbar .toolbar-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rich-editor-prose {
          min-height: ${editorHeight};
          padding: 40px 52px 52px;
          background: rgba(255,255,255,0.78);
          color: #111827;
          outline: none;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .rich-editor-prose:focus {
          outline: none;
        }
        .rich-editor-prose h1 {
          font-size: clamp(2.2rem, 2vw + 1.1rem, 3.2rem);
          line-height: 1.1;
          font-weight: 700;
          margin: 0 0 1.5rem;
          letter-spacing: -0.05em;
        }
        .rich-editor-prose h2 {
          font-size: 2rem;
          line-height: 1.2;
          font-weight: 700;
          margin: 2rem 0 1rem;
        }
        .rich-editor-prose p {
          margin: 0 0 1rem;
          font-size: 1.04rem;
          line-height: 1.7;
          color: rgba(17, 24, 39, 0.9);
        }
        .rich-editor-prose p strong,
        .rich-editor-prose p b {
          font-weight: 700;
        }
        .rich-editor-prose p em,
        .rich-editor-prose p i {
          font-style: italic;
        }
        .rich-editor-prose a {
          color: #4f46e5;
          text-decoration: underline;
        }
        .rich-editor-prose ul,
        .rich-editor-prose ol {
          padding-left: 1.5rem;
          margin: 0 0 1rem;
        }
        .rich-editor-prose li {
          margin-bottom: 0.45rem;
        }
        .rich-editor-prose code {
          display: inline-block;
          padding: 0.5rem 0.9rem;
          background: rgba(15, 23, 42, 0.06);
          border-radius: 12px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          color: #111827;
          font-size: 0.96rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        }
        .rich-editor-prose blockquote {
          border-left: 3px solid #d1d5db;
          padding-left: 0.9rem;
          color: #4b5563;
          margin: 1.25rem 0;
        }
      `}</style>

      <div className="rich-editor-shell">
        {!readOnly && (
          <>
            <div className="rich-editor-topbar">
              <div className="rich-editor-tabs" aria-label="Editor mode selector">
                {['Agent editor', 'Docx editor', 'Notion-like editor', 'Simple editor'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`rich-editor-tab${tab === 'Simple editor' ? ' is-active' : ''}`}
                    aria-label={tab}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="rich-editor-toolbar" aria-label="Rich editor toolbar">
              <button type="button" aria-label="Undo" title="Undo">↶</button>
              <button type="button" aria-label="Redo" title="Redo">↷</button>
              <div className="toolbar-spacer" />
              <button type="button" aria-label="Heading" title="Heading">H</button>
              <button type="button" aria-label="Bold" title="Bold" className={editor?.isActive('bold') ? 'is-active' : ''} onClick={() => editor?.chain().focus().toggleBold().run()}>B</button>
              <button type="button" aria-label="Italic" title="Italic" className={editor?.isActive('italic') ? 'is-active' : ''} onClick={() => editor?.chain().focus().toggleItalic().run()}>I</button>
              <button type="button" aria-label="Strike" title="Strike" onClick={() => editor?.chain().focus().toggleStrike().run()}>S</button>
              <button type="button" aria-label="Code" title="Code" onClick={() => editor?.chain().focus().toggleCode().run()}><code>{'<'}</code></button>
              <button type="button" aria-label="Link" title="Link">⌁</button>
              <button type="button" aria-label="Bullet list" title="Bullet list" className={editor?.isActive('bulletList') ? 'is-active' : ''} onClick={() => editor?.chain().focus().toggleBulletList().run()}>•</button>
              <button type="button" aria-label="Ordered list" title="Ordered list" className={editor?.isActive('orderedList') ? 'is-active' : ''} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1.</button>
              <div className="toolbar-spacer" />
              <button type="button" aria-label="Align left" title="Align left">≡</button>
              <button type="button" aria-label="Quote" title="Quote" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>❝</button>
              <div className="toolbar-actions">
                <button type="button" aria-label="Search" title="Search">⌕</button>
                <button type="button" aria-label="Theme" title="Theme">☼</button>
              </div>
            </div>
          </>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichEditor;
