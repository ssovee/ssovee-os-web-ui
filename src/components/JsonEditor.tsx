import Editor, { type EditorProps } from "@monaco-editor/react";
import React from "react";

export interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: EditorProps["language"];
  theme?: EditorProps["theme"];
  height?: EditorProps["height"];
  options?: EditorProps["options"];
  className?: string;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  language = "json",
  theme = "light",
  height = "100%",
  options,
  className,
}) => {
  return (
    <div className={className} style={{ height }}>
      <Editor
        height="100%"
        language={language}
        theme={theme}
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? "")}
        options={options}
      />
    </div>
  );
};

export default JsonEditor;
