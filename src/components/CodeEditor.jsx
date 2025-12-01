import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

export function CodeEditor({ code, onChange }) {
    // We need to ensure the editor updates when the `code` prop changes externally
    // (e.g. when switching steps or resetting)

    return (
        <div className="h-full w-full border border-gray-800 rounded-lg overflow-hidden shadow-sm">
            <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={onChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    readOnly: !onChange, // Make read-only if no onChange handler
                }}
            />
        </div>
    );
}
