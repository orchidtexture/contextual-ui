'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Eye,
  Bot,
  Database,
  Sliders,
  X,
  FileCode,
} from 'lucide-react';
import type { PromptOptions } from '../types';

interface PromptTweakerProps {
  promptOptions: PromptOptions;
  onChangeOptions: (updated: Partial<PromptOptions>) => void;
  onCopyPrompt: () => void;
  copied: boolean;
  generatedPrompt: string;
}

export function PromptTweaker({
  promptOptions,
  onChangeOptions,
  onCopyPrompt,
  copied,
  generatedPrompt,
}: PromptTweakerProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const AI_TARGETS = [
    { id: 'cursor', label: 'Cursor / Windsurf', badge: 'Rules' },
    { id: 'claude', label: 'Claude Code', badge: 'CLI' },
    { id: 'chatgpt', label: 'ChatGPT / GPT-4o', badge: 'Chat' },
    { id: 'v0', label: 'v0.dev / Next', badge: 'UI' },
  ];

  const INTEGRATIONS = [
    { id: 'none', label: 'None (Standalone)' },
    { id: 'resend', label: 'Resend (Email Notifications)' },
    { id: 'supabase', label: 'Supabase Database' },
    { id: 'prisma', label: 'Prisma ORM' },
    { id: 'drizzle', label: 'Drizzle ORM' },
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950 font-sans text-xs space-y-5">
      {/* Pane Title */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Prompt Generator
          </h2>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">vibe-ready</span>
      </div>

      {/* Target AI Assistant */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-zinc-400 font-medium">
          <Bot className="w-3.5 h-3.5 text-zinc-500" />
          <span>Target AI Assistant</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {AI_TARGETS.map((target) => {
            const isSelected = promptOptions.aiTarget === target.id;
            return (
              <button
                key={target.id}
                type="button"
                onClick={() => onChangeOptions({ aiTarget: target.id as any })}
                className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-accent/10 border-accent/40 text-zinc-100 shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <span className="font-medium text-[11px] truncate w-full">
                  {target.label}
                </span>
                <span className="text-[9px] text-zinc-500 font-mono mt-0.5">
                  {target.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Backend & Data Integration */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-zinc-400 font-medium">
          <Database className="w-3.5 h-3.5 text-zinc-500" />
          <span>Backend Integration</span>
        </label>
        <select
          value={promptOptions.integration}
          onChange={(e) => onChangeOptions({ integration: e.target.value as any })}
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-2.5 py-2 text-zinc-200 focus:outline-none focus:border-accent font-sans text-xs"
        >
          {INTEGRATIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Context / Requirements */}
      <div className="space-y-2 flex-1 flex flex-col min-h-[140px]">
        <label className="flex items-center gap-1.5 text-zinc-400 font-medium">
          <Sliders className="w-3.5 h-3.5 text-zinc-500" />
          <span>Custom Instructions (Optional)</span>
        </label>
        <textarea
          value={promptOptions.customInstructions}
          onChange={(e) => onChangeOptions({ customInstructions: e.target.value })}
          placeholder="e.g., Send confirmation email to user, style with rounded-3xl borders, add Cloudflare Turnstile captcha..."
          className="w-full flex-1 bg-zinc-900/80 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-accent text-xs placeholder:text-zinc-600 resize-none font-mono"
        />
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-zinc-800/80 space-y-2 shrink-0">
        <button
          type="button"
          onClick={onCopyPrompt}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all shadow-md ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-accent hover:bg-accent/90 text-zinc-950 shadow-accent/20 hover:shadow-accent/30'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy AI Prompt</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800/80 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview Generated Prompt</span>
        </button>
      </div>

      {/* Full Prompt Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-950/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  Generated AI Prompt Preview
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCopyPrompt}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent text-zinc-950 font-semibold text-xs hover:bg-accent/90 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-5 bg-[#272822] text-xs font-mono">
              <pre className="!bg-transparent !p-0 !m-0 leading-relaxed whitespace-pre-wrap text-zinc-200">
                {generatedPrompt}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
