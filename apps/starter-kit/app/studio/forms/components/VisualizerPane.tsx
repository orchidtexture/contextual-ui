'use client';

import React, { useState } from 'react';
import { AutoForm, type FormEntity } from 'contextual-ui';
import { Play, RotateCcw, Sparkles } from 'lucide-react';
import type { ConsoleLog } from '../types';

interface VisualizerPaneProps {
  form: FormEntity;
  onAddLog: (log: Omit<ConsoleLog, 'id' | 'timestamp'>) => void;
}

export function VisualizerPane({ form, onAddLog }: VisualizerPaneProps) {
  // Key state to reset the inner form state when reset button is clicked
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = async (values: Record<string, any>) => {
    onAddLog({
      type: 'info',
      title: `${form.method || 'POST'} ${form.endpoint || '/api/form'} [Request Payload]`,
      payload: values,
    });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    onAddLog({
      type: 'success',
      title: `200 OK — ${form.endpoint || '/api/form'}`,
      payload: {
        success: true,
        message: form.successMessage || 'Form submitted successfully!',
        dataReceived: values,
      },
    });
  };

  const handleError = (errors: any) => {
    onAddLog({
      type: 'error',
      title: 'Validation Error (Form Rejected)',
      payload: errors?.flatten?.()?.fieldErrors || errors,
    });
  };

  const handleReset = () => {
    setResetKey((k) => k + 1);
    onAddLog({
      type: 'info',
      title: 'Form fields reset to defaults',
      payload: null,
    });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      {/* Pane Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/60 shrink-0">
        <div className="flex items-center gap-2">
          <Play className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-zinc-200">
            Interactive Visualizer
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {form.fields.length} {form.fields.length === 1 ? 'field' : 'fields'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 border border-zinc-800 transition-colors"
          title="Reset form values"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Form</span>
        </button>
      </div>

      {/* Form Canvas Area */}
      <div className="flex-1 overflow-y-auto p-6 flex items-start justify-center bg-radial-pattern">
        <div className="w-full max-w-lg bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
          {form.title && (
            <div className="mb-5 pb-3 border-b border-zinc-800">
              <h2 className="text-base font-semibold text-zinc-100">{form.title}</h2>
              {form.description && (
                <p className="text-xs text-zinc-400 mt-1">{form.description}</p>
              )}
            </div>
          )}

          <AutoForm
            key={resetKey}
            form={form}
            onSubmit={handleSubmit}
            onError={handleError}
            className="space-y-4"
          />
        </div>
      </div>
    </div>
  );
}
