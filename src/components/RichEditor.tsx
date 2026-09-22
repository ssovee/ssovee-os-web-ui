"use client";

import { useEffect, useRef } from "react";
import {
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon,
  CodeIcon,
  EraserIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  MinusIcon,
  QuotesIcon,
} from "@phosphor-icons/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Button from "./Button";

export interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  isDarkTheme?: boolean;
}

const RichEditor = ({ content, onChange, isDarkTheme }: RichEditorProps) => {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const editorTheme = isDarkTheme ? "vs-dark" : "light";

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: updatedEditor }) => {
      onChangeRef.current(updatedEditor.getHTML());
    },
  }, []);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  return (
    <>
      <div className="mt-3 flex flex-wrap items-center gap-1 border-b border-primary pb-2 text-neutral-500 [&_button]:text-neutral-500">
        <div className="flex items-center gap-0.5">
          <Button type="button" variant={editor?.isActive("bold") ? "primary" : "ghost"} size="sm" onClick={() => editor?.chain().focus().toggleBold().run()} aria-label="Bold text" title="Bold"><strong>B</strong></Button>
          <Button type="button" variant={editor?.isActive("italic") ? "primary" : "ghost"} size="sm" onClick={() => editor?.chain().focus().toggleItalic().run()} aria-label="Italic text" title="Italic"><em>I</em></Button>
          <Button type="button" variant={editor?.isActive("strike") ? "primary" : "ghost"} size="sm" onClick={() => editor?.chain().focus().toggleStrike().run()} aria-label="Strikethrough text" title="Strikethrough"><s>S</s></Button>
        </div>
        <div className="flex items-center gap-0.5">
          <Button type="button" variant={editor?.isActive("heading", { level: 1 }) ? "primary" : "ghost"} size="sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} aria-label="Heading 1" title="Heading 1">H1</Button>
          <Button type="button" variant={editor?.isActive("heading", { level: 2 }) ? "primary" : "ghost"} size="sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Heading 2" title="Heading 2">H2</Button>
          <Button type="button" variant={editor?.isActive("heading", { level: 3 }) ? "primary" : "ghost"} size="sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="Heading 3" title="Heading 3">H3</Button>
        </div>
        <div className="flex items-center gap-0.5">
          <Button type="button" variant={editor?.isActive("bulletList") ? "primary" : "ghost"} size="sm" onClick={() => editor?.chain().focus().toggleBulletList().run()} aria-label="Bullet list" title="Bullet list"><ListBulletsIcon size={17} /></Button>
          <Button type="button" variant={editor?.isActive("orderedList") ? "primary" : "ghost"} size="sm" onClick={() => editor?.chain().focus().toggleOrderedList().run()} aria-label="Numbered list" title="Numbered list"><ListNumbersIcon size={17} /></Button>
          <Button type="button" variant={editor?.isActive("blockquote") ? "primary" : "ghost"} size="sm" onClick={() => editor?.chain().focus().toggleBlockquote().run()} aria-label="Block quote" title="Block quote"><QuotesIcon size={17} /></Button>
        </div>
        <div className="flex items-center gap-0.5">
          <Button type="button" variant={editor?.isActive("code") ? "primary" : "ghost"} size="sm" onClick={() => editor?.chain().focus().toggleCode().run()} aria-label="Inline code" title="Inline code"><CodeIcon size={17} /></Button>
          <Button type="button" variant={editor?.isActive("codeBlock") ? "primary" : "ghost"} size="sm" onClick={() => editor?.chain().focus().toggleCodeBlock().run()} aria-label="Code block" title="Code block"><span className="text-xs">&lt;/&gt;</span></Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor?.chain().focus().setHorizontalRule().run()} aria-label="Horizontal rule" title="Horizontal rule"><MinusIcon size={17} /></Button>
        </div>
        <div className="flex items-center gap-0.5">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor?.chain().focus().undo().run()} aria-label="Undo" title="Undo"><ArrowCounterClockwiseIcon size={17} /></Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor?.chain().focus().redo().run()} aria-label="Redo" title="Redo"><ArrowClockwiseIcon size={17} /></Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()} aria-label="Clear formatting" title="Clear formatting"><EraserIcon size={17} /></Button>
        </div>
      </div>
      <EditorContent
        editor={editor}
        className={`mt-4 min-h-52 rounded-md border border-brand-color p-3 text-sm leading-6 text-neutral-500 outline-none transition-colors focus-within:border-brand-color [&_.ProseMirror]:min-h-44 [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:my-2 [&_.ProseMirror_h1]:my-3 [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:my-3 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h3]:my-3 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:my-2 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_blockquote]:my-3 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-brand-color [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_pre]:my-3 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:bg-surface-3 [&_.ProseMirror_pre]:p-3 ${editorTheme === "vs-dark" ? "bg-primary" : "bg-secondary"}`}
      />
    </>
  );
};

export default RichEditor;