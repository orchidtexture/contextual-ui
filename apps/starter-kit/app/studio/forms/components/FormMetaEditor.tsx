'use client';

import React, { useState } from 'react';
import type { FormEntity } from 'contextual-ui';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

interface FormMetaEditorProps {
  form: FormEntity;
  onChange: (updated: Partial<FormEntity>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function FormMetaEditor({
  form,
  onChange,
  isOpen: controlledIsOpen,
  onToggle,
}: FormMetaEditorProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isExpanded = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div
      className={`border rounded-xl transition-all duration-150 backdrop-blur-md ${
        isExpanded
          ? 'border-zinc-700/80 bg-zinc-900/70 shadow-md'
          : 'border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700/80 hover:bg-zinc-900/30'
      }`}
    >
      {/* Clickable Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer select-none"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1 rounded bg-zinc-800/80 text-accent shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-zinc-200 truncate">
              Form Configuration
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono block truncate">
              {form.method || 'POST'} {form.endpoint || '/api/form'}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label={isExpanded ? 'Collapse settings' : 'Expand settings'}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Collapsible Body - Fully Vertical Layout without nested scrollbars */}
      {isExpanded && (
        <div className="p-3.5 pt-1 border-t border-zinc-800/80 space-y-3 text-xs font-mono">
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              Form Title
            </label>
            <input
              type="text"
              value={form.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full bg-zinc-950/60 backdrop-blur-sm border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-accent"
              placeholder="e.g. Contact Us"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              Description / Subtitle
            </label>
            <textarea
              value={form.description || ''}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={2}
              className="w-full bg-zinc-950/60 backdrop-blur-sm border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-accent resize-none text-[11px]"
              placeholder="Fill out the details below..."
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              API Endpoint
            </label>
            <input
              type="text"
              value={form.endpoint}
              onChange={(e) => onChange({ endpoint: e.target.value })}
              className="w-full bg-zinc-950/60 backdrop-blur-sm border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-accent"
              placeholder="/api/contact"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              HTTP Method
            </label>
            <select
              value={form.method || 'POST'}
              onChange={(e) => onChange({ method: e.target.value as any })}
              className="w-full bg-zinc-950/60 backdrop-blur-sm border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-accent"
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              Submit Button Label
            </label>
            <input
              type="text"
              value={form.submitLabel || 'Submit'}
              onChange={(e) => onChange({ submitLabel: e.target.value })}
              className="w-full bg-zinc-950/60 backdrop-blur-sm border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-accent"
              placeholder="Submit"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              Form ID (slug)
            </label>
            <input
              type="text"
              value={form.id}
              onChange={(e) => onChange({ id: e.target.value })}
              className="w-full bg-zinc-950/60 backdrop-blur-sm border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-accent"
              placeholder="contact-sales"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              Success Message
            </label>
            <input
              type="text"
              value={form.successMessage || ''}
              onChange={(e) => onChange({ successMessage: e.target.value })}
              className="w-full bg-zinc-950/60 backdrop-blur-sm border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-accent"
              placeholder="Thank you for your submission!"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              Schema.org Action
            </label>
            <input
              type="text"
              value={form.actionType || 'ContactAction'}
              onChange={(e) => onChange({ actionType: e.target.value })}
              className="w-full bg-zinc-950/60 backdrop-blur-sm border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-accent"
              placeholder="ContactAction"
            />
          </div>
        </div>
      )}
    </div>
  );
}
