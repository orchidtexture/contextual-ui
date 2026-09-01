'use client';

import React from 'react';
import { Terminal, Trash2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import type { ConsoleLog } from '../types';

interface ConsoleOutputProps {
  logs: ConsoleLog[];
  onClear: () => void;
}

export function ConsoleOutput({ logs, onClear }: ConsoleOutputProps) {
  return (
    <div className="flex flex-col h-full bg-zinc-950 font-mono text-xs overflow-hidden border-t border-zinc-800/80">
      {/* Console Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/80 border-b border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Runtime Console
          </span>
          {logs.length > 0 && (
            <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full">
              {logs.length}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClear}
          disabled={logs.length === 0}
          className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 disabled:opacity-30 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      {/* Console Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600 p-4">
            <Terminal className="w-6 h-6 mb-1.5 opacity-40" />
            <p className="text-xs">No console logs yet.</p>
            <p className="text-[11px] text-zinc-600 mt-0.5">
              Interact with or submit the form on the right to see request payloads and validation errors.
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const isSuccess = log.type === 'success';
            const isError = log.type === 'error';

            return (
              <div
                key={log.id}
                className={`p-2 rounded-lg border text-xs space-y-1 ${
                  isSuccess
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                    : isError
                    ? 'bg-rose-950/20 border-rose-800/40 text-rose-300'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-semibold">
                    {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {isError && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
                    {!isSuccess && !isError && <Info className="w-3.5 h-3.5 text-blue-400" />}
                    <span>{log.title}</span>
                  </div>
                  <span className="text-zinc-500 text-[10px]" suppressHydrationWarning>
                    {log.timestamp}
                  </span>
                </div>

                {log.payload && (
                  <pre className="text-[11px] bg-black/40 p-2 rounded overflow-x-auto text-zinc-300 font-mono">
                    {typeof log.payload === 'string'
                      ? log.payload
                      : JSON.stringify(log.payload, null, 2)}
                  </pre>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
