import Editor, { type EditorProps } from "@monaco-editor/react";
import React, { useCallback, useMemo } from "react";

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: EditorProps["language"];
  height?: EditorProps["height"];
  options?: EditorProps["options"];
  className?: string;
  isDarkTheme?: boolean;
}

export type JsonEditorProps = CodeEditorProps;

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = "json",
  height = "100%",
  options,
  className,
  isDarkTheme
}) => {
  const editorTheme = useMemo(() => {
    if (typeof isDarkTheme === "undefined") return "light";
    const isDark = Boolean(isDarkTheme);
    return isDark ? "vs-dark" : "light";
  }, [isDarkTheme]);
  return (
    <div className={className} style={{ height }}>
      <Editor
        height="100%"
        language={language}
        theme={editorTheme}
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? "")}
        options={options}
      />
    </div>
  );
};

export default CodeEditor;
