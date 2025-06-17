import React from 'react';
import Editor from '@monaco-editor/react';
import { FileItem } from '../types';
import { FileText, Code } from 'lucide-react';

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full glass rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 mb-2">No file selected</p>
          <p className="text-gray-500 text-sm">Choose a file from the explorer to view its code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full glass rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white">{file.name}</span>
        </div>
        <div className="text-xs text-gray-400">
          {file.content ? `${file.content.length} characters` : 'Empty file'}
        </div>
      </div>
      
      <div className="h-[calc(100%-4rem)]">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          theme="vs-dark"
          value={file.content || ''}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
            },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 0,
            lineDecorationsWidth: 0,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            foldingHighlight: true,
            foldingImportsByDefault: true,
            foldingMaximumRegions: 5000,
            unfoldOnClickAfterEndOfLine: false,
            links: true,
            colorDecorators: true,
          }}
        />
      </div>
    </div>
  );
}