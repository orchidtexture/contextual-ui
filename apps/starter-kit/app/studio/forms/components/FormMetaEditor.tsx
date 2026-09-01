'use client';

import React from 'react';
import type { FormEntity } from 'contextual-ui';
import { Settings, X } from 'lucide-react';

interface FormMetaEditorProps {
  form: FormEntity;
  onChange: (updated: Partial<FormEntity>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function FormMetaEditor({
  form,
  onChange,
  isOpen,
  onClose,
}: FormMetaEditorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-zinc-100">Form Configuration</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1">Form ID (slug)</label>
              <input
                type="text"
                value={form.id}
                onChange={(e) => onChange({ id: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-accent"
                placeholder="contact-form"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Schema.org Action</label>
              <input
                type="text"
                value={form.actionType || 'ContactAction'}
                onChange={(e) => onChange({ actionType: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-accent"
                placeholder="ContactAction"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Form Title</label>
            <input
              type="text"
              value={form.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-accent"
              placeholder="Contact Us"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Description / Subtitle</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={2}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-accent"
              placeholder="Provide information so we can reach you..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1">API Endpoint</label>
              <input
                type="text"
                value={form.endpoint}
                onChange={(e) => onChange({ endpoint: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-accent"
                placeholder="/api/contact"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">HTTP Method</label>
              <select
                value={form.method || 'POST'}
                onChange={(e) => onChange({ method: e.target.value as any })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-accent"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1">Submit Button Label</label>
              <input
                type="text"
                value={form.submitLabel || 'Submit'}
                onChange={(e) => onChange({ submitLabel: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-accent"
                placeholder="Submit"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Success Message</label>
              <input
                type="text"
                value={form.successMessage || ''}
                onChange={(e) => onChange({ successMessage: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-accent"
                placeholder="Thank you!"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-accent text-zinc-950 font-semibold text-xs hover:bg-accent/90 transition-colors"
          >
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
}
