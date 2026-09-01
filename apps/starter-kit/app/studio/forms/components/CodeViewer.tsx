'use client';

import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism-okaidia.css';
import { Copy, Check, Sparkles, FileCode } from 'lucide-react';
import type { StudioFileType } from '../types';

interface CodeViewerProps {
  activeFile: StudioFileType;
  code: string;
  formId: string;
}

export function CodeViewer({ activeFile, code, formId }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, activeFile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguage = () => {
    if (activeFile.endsWith('.tsx')) return 'tsx';
    if (activeFile.endsWith('.ts')) return 'typescript';
    if (activeFile.endsWith('.json')) return 'json';
    if (activeFile.endsWith('.md') || activeFile.endsWith('.txt')) return 'markdown';
    return 'typescript';
  };

  const getFileDisplayName = () => {
    if (activeFile === 'schema.ts') return `${formId || 'form'}.schema.ts`;
    if (activeFile === 'FormComponent.tsx') return `${formId || 'Form'}Component.tsx`;
    if (activeFile === 'route.ts') return 'app/api/.../route.ts';
    if (activeFile === 'ai-prompt.txt') return 'ai-prompt.md';
    return activeFile;
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden font-mono text-xs">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/60 shrink-0">
        <div className="flex items-center gap-2">
          {activeFile === 'ai-prompt.txt' ? (
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          ) : (
            <FileCode className="w-3.5 h-3.5 text-accent" />
          )}
          <span className="text-zinc-200 font-medium">
            {getFileDisplayName()}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
            {getLanguage()}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans font-medium transition-all ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display Area */}
      <div className="flex-1 overflow-auto p-4 bg-[#272822]">
        <pre
          tabIndex={0}
          suppressHydrationWarning
          className="!bg-transparent !p-0 !m-0 font-mono text-xs leading-relaxed"
        >
          <code
            suppressHydrationWarning
            className={`language-${getLanguage()}`}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
