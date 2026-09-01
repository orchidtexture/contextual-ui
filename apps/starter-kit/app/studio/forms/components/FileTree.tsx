'use client';

import React from 'react';
import { FileCode, FileText, Folder, ChevronDown, Sparkles } from 'lucide-react';
import type { StudioFileType } from '../types';

interface FileTreeProps {
  activeFile: StudioFileType;
  onSelectFile: (file: StudioFileType) => void;
  formId: string;
  endpoint: string;
}

export function FileTree({
  activeFile,
  onSelectFile,
  formId,
  endpoint,
}: FileTreeProps) {
  const cleanEndpoint = (endpoint || 'api/form').replace(/^\/+/, '');

  return (
    <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 font-mono text-xs">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-2 px-1 flex items-center justify-between">
        <span>Generated Files</span>
        <span className="text-[10px] text-zinc-600">4 artifacts</span>
      </div>

      <div className="space-y-1 select-none">
        {/* src folder */}
        <div>
          <div className="flex items-center gap-1.5 text-zinc-400 py-0.5 px-1 font-medium">
            <Folder className="w-3.5 h-3.5 text-accent/80 shrink-0" />
            <span>src/</span>
          </div>
          <div className="pl-4 space-y-0.5">
            {/* schema.ts */}
            <button
              type="button"
              onClick={() => onSelectFile('schema.ts')}
              className={`w-full text-left flex items-center gap-1.5 py-1 px-2 rounded-md transition-colors ${
                activeFile === 'schema.ts'
                  ? 'bg-accent/15 text-accent font-medium border border-accent/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{formId || 'form'}.schema.ts</span>
            </button>

            {/* FormComponent.tsx */}
            <button
              type="button"
              onClick={() => onSelectFile('FormComponent.tsx')}
              className={`w-full text-left flex items-center gap-1.5 py-1 px-2 rounded-md transition-colors ${
                activeFile === 'FormComponent.tsx'
                  ? 'bg-accent/15 text-accent font-medium border border-accent/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{formId || 'Form'}Component.tsx</span>
            </button>
          </div>
        </div>

        {/* app/api folder */}
        <div>
          <div className="flex items-center gap-1.5 text-zinc-400 py-0.5 px-1 font-medium">
            <Folder className="w-3.5 h-3.5 text-accent/80 shrink-0" />
            <span>app/{cleanEndpoint}/</span>
          </div>
          <div className="pl-4 space-y-0.5">
            {/* route.ts */}
            <button
              type="button"
              onClick={() => onSelectFile('route.ts')}
              className={`w-full text-left flex items-center gap-1.5 py-1 px-2 rounded-md transition-colors ${
                activeFile === 'route.ts'
                  ? 'bg-accent/15 text-accent font-medium border border-accent/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>route.ts</span>
            </button>
          </div>
        </div>

        {/* ai-prompt.txt */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onSelectFile('ai-prompt.txt')}
            className={`w-full text-left flex items-center justify-between py-1 px-2 rounded-md transition-colors ${
              activeFile === 'ai-prompt.txt'
                ? 'bg-purple-500/15 text-purple-300 font-medium border border-purple-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">ai-prompt.md</span>
            </div>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">
              AI Ready
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
