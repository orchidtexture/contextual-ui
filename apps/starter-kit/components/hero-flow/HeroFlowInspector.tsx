'use client';

import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import { FlowNodeData } from './types';

interface HeroFlowInspectorProps {
  selectedNode: FlowNodeData | null;
  onClose?: () => void;
}

export function HeroFlowInspector({ selectedNode, onClose }: HeroFlowInspectorProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'spec'>('code');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [selectedNode, activeTab]);

  if (!selectedNode) return null;

  const { title, subtitle, badge, icon, color, accentClass, description, codeSnippet, details } =
    selectedNode;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Top Bar */}
      <div className="px-5 py-3.5 bg-zinc-900/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base border border-zinc-700/60 bg-zinc-950 shadow-inner"
            style={{ borderColor: `${color}40` }}
          >
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${accentClass}`}>
                {badge}
              </span>
              <span className="text-zinc-600 font-mono text-xs">/</span>
              <h3 className="text-xs font-bold text-zinc-100">{title}</h3>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">{subtitle}</p>
          </div>
        </div>

        {/* Tab Buttons & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-950 rounded-lg p-0.5 border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'code'
                  ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Snippet
            </button>
            <button
              onClick={() => setActiveTab('spec')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'spec'
                  ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Spec Details
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5"
            title="Copy code"
          >
            {copied ? (
              <>
                <span className="text-emerald-400 text-xs">✓</span>
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Description line */}
      <div className="px-5 py-2.5 bg-zinc-900/30 border-b border-zinc-800/60 text-xs text-zinc-300 font-sans leading-relaxed">
        {description}
      </div>

      {/* Content Area */}
      <div className="p-4 bg-zinc-950">
        {activeTab === 'code' ? (
          <div className="relative">
            <div className="absolute top-2 right-3 text-[10px] font-mono text-zinc-500 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800 z-10 pointer-events-none">
              {codeSnippet.filename}
            </div>
            <pre className="!bg-zinc-900/90 !text-zinc-200 !p-4 !rounded-xl text-xs font-mono overflow-x-auto border border-zinc-800 max-h-[260px] shadow-inner">
              <code className={`language-${codeSnippet.language}`}>{codeSnippet.code}</code>
            </pre>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {details.map((detail, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  {detail.label}
                </div>
                <div className="text-xs font-semibold text-zinc-200">
                  {detail.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
