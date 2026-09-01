'use client';

import React, { useState, useMemo } from 'react';
import { AutoForm, type FormEntity } from 'contextual-ui';
import { Play, RotateCcw, RefreshCw } from 'lucide-react';
import type { ConsoleLog } from '../types';

interface VisualizerPaneProps {
  form: FormEntity;
  onAddLog: (log: Omit<ConsoleLog, 'id' | 'timestamp'>) => void;
  resetTrigger?: number | string;
}

export function VisualizerPane({ form, onAddLog, resetTrigger }: VisualizerPaneProps) {
  const [resetKey, setResetKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom component slots matching the interactive demo in DocsClient.tsx
  const autoFormCustomSlots = useMemo(
    () => ({
      Field: ({ children, className }: any) => (
        <div className={`space-y-1 ${className || ''}`}>{children}</div>
      ),
      Label: ({ htmlFor, children }: any) => (
        <label htmlFor={htmlFor} className="block text-xs font-mono text-zinc-300">
          {children}
        </label>
      ),
      Input: ({ field, dataInvalid, ...props }: any) => (
        <input
          {...props}
          className="w-full px-3 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-xs"
        />
      ),
      TextArea: ({ field, dataInvalid, ...props }: any) => (
        <textarea
          rows={3}
          {...props}
          className="w-full px-3 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-xs"
        />
      ),
      Select: ({ field, options, dataInvalid, children, ...props }: any) => (
        <select
          {...props}
          className="w-full px-3 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-xs cursor-pointer"
        >
          {children}
        </select>
      ),
      ErrorMessage: ({ error }: any) => (
        <span className="text-rose-400 text-[11px] font-mono mt-1 block">{error}</span>
      ),
      Submit: ({ isSubmitting: isInternalSubmitting, children, ...props }: any) => (
        <button
          type="submit"
          disabled={isSubmitting || isInternalSubmitting}
          className="w-full py-2.5 bg-accent hover:opacity-90 disabled:opacity-50 text-zinc-950 font-medium rounded-lg transition-colors text-xs font-mono cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          {...props}
        >
          {isSubmitting || isInternalSubmitting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Submitting to {form.endpoint || '/api/form'}...</span>
            </>
          ) : (
            <span>{children}</span>
          )}
        </button>
      ),
      Section: ({ title, description, children }: any) => (
        <div className="space-y-4">
          {(title || description) && (
            <div className="space-y-1 mb-2">
              {title && <h4 className="text-sm font-semibold text-zinc-100">{title}</h4>}
              {description && (
                <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
              )}
            </div>
          )}
          <div className="space-y-3">{children}</div>
        </div>
      ),
    }),
    [isSubmitting, form.endpoint]
  );

  const handleSubmit = async (values: Record<string, any>) => {
    setIsSubmitting(true);
    onAddLog({
      type: 'info',
      title: `${form.method || 'POST'} ${form.endpoint || '/api/form'} [Request Payload]`,
      payload: values,
    });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);

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
    setIsSubmitting(false);
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
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-900/60 shrink-0">
        <div className="flex items-center gap-2">
          <Play className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-semibold text-zinc-200">
            Interactive Live Demo
          </span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 border border-zinc-800 transition-colors cursor-pointer"
          title="Reset form values"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Form</span>
        </button>
      </div>

      {/* Form Canvas Area with subtle accent gradient */}
      <div className="flex-1 overflow-y-auto p-6 flex items-start justify-center bg-canvas-gradient relative">
        {/* Subtle Ambient Light Orb behind card */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Glass Form Card */}
        <div className="w-full max-w-md p-6 bg-glass-card relative z-10">
          <AutoForm
            key={`${form.id}-${resetKey}-${resetTrigger ?? 0}`}
            form={form}
            components={autoFormCustomSlots}
            onSubmit={handleSubmit}
            onError={handleError}
            className="space-y-4"
          />
        </div>
      </div>
    </div>
  );
}
