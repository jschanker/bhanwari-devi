import React, { useState } from "react";

import "codemirror/lib/codemirror.css";

// Themes
import "codemirror/theme/night.css";

// Languages
import "codemirror/mode/python/python";

import { Controlled as ControlledEditorComponent } from "react-codemirror2";

const CodeMirrorEditor = ({ value, setEditorState }) => {
  const handleEditorReset = (value) => {
    setEditorState(value);
  };

  const handleEditorChange = (editor, data, value) => {
    setEditorState(value);
  };

  return (
    <div className="editor-container">
      <ControlledEditorComponent
        onBeforeChange={handleEditorChange}
        value={value}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: "python",
          lineNumbers: true,
          indentUnit: 4,
          matchBrackets: true,
          singleCursorHeightPerLine: false,
          // readOnly: "true",
        }}
      />
    </div>
  );
};

export default CodeMirrorEditor;
