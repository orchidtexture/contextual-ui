'use client';

import React, { useState } from 'react';
import type { FormField } from 'contextual-ui';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings2,
  Type,
  Mail,
  ListFilter,
  CheckSquare,
  AlignLeft,
  Hash,
  Globe,
  Phone,
  Lock,
} from 'lucide-react';

interface FieldBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'textarea', label: 'Textarea', icon: AlignLeft },
  { value: 'select', label: 'Select Dropdown', icon: ListFilter },
  { value: 'boolean', label: 'Checkbox (Boolean)', icon: CheckSquare },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'url', label: 'URL', icon: Globe },
  { value: 'tel', label: 'Phone', icon: Phone },
  { value: 'password', label: 'Password', icon: Lock },
];

export function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleAddField = () => {
    const newFieldName = `field_${fields.length + 1}`;
    const newField: FormField = {
      name: newFieldName,
      type: 'text',
      label: `New Field ${fields.length + 1}`,
      required: false,
      placeholder: '',
    };
    onChange([...fields, newField]);
    setExpandedIndex(fields.length);
  };

  const handleRemoveField = (index: number) => {
    const updated = fields.filter((_, i) => i !== index);
    onChange(updated);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleUpdateField = (index: number, updates: Partial<FormField>) => {
    const updated = fields.map((f, i) => (i === index ? { ...f, ...updates } : f));
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === fields.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...fields];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
    setExpandedIndex(targetIndex);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Form Fields ({fields.length})
        </span>
        <button
          type="button"
          onClick={handleAddField}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Field</span>
        </button>
      </div>

      <div className="space-y-2">
        {fields.map((field, idx) => {
          const isExpanded = expandedIndex === idx;
          const TypeIcon =
            FIELD_TYPES.find((t) => t.value === field.type)?.icon || Type;

          return (
            <div
              key={`${field.name}-${idx}`}
              className={`border rounded-xl transition-all duration-150 overflow-hidden ${
                isExpanded
                  ? 'border-zinc-700 bg-zinc-900/90 shadow-md'
                  : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700'
              }`}
            >
              {/* Field Header Summary */}
              <div
                className="flex items-center justify-between p-2.5 cursor-pointer select-none"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="p-1 rounded bg-zinc-800 text-zinc-400">
                    <TypeIcon className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-zinc-200 truncate">
                        {field.label || field.name}
                      </span>
                      {field.required && (
                        <span className="text-[10px] text-accent font-mono">*</span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono block">
                      {field.name} ({field.type})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Move Up"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(idx, 'up');
                    }}
                    className="p-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Move Down"
                    disabled={idx === fields.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(idx, 'down');
                    }}
                    className="p-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Delete Field"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveField(idx);
                    }}
                    className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Field Details Form */}
              {isExpanded && (
                <div className="p-3 pt-0 border-t border-zinc-800/80 space-y-3 text-xs font-mono mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Variable Key
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) =>
                          handleUpdateField(idx, {
                            name: e.target.value.replace(/\s+/g, ''),
                          })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 focus:outline-none focus:border-accent"
                        placeholder="fieldKey"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Field Type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) =>
                          handleUpdateField(idx, { type: e.target.value as any })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 focus:outline-none focus:border-accent"
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Display Label
                      </label>
                      <input
                        type="text"
                        value={field.label || ''}
                        onChange={(e) =>
                          handleUpdateField(idx, { label: e.target.value })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 focus:outline-none focus:border-accent"
                        placeholder="Display Label"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) =>
                          handleUpdateField(idx, { placeholder: e.target.value })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 focus:outline-none focus:border-accent"
                        placeholder="e.g. Type here..."
                      />
                    </div>
                  </div>

                  {/* Validation and Options */}
                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                      <input
                        type="checkbox"
                        checked={field.required || false}
                        onChange={(e) =>
                          handleUpdateField(idx, { required: e.target.checked })
                        }
                        className="rounded border-zinc-700 bg-zinc-950 text-accent focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-[11px]">Required Field</span>
                    </label>

                    {(field.type === 'text' || field.type === 'textarea') && (
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-zinc-500">Min Len:</span>
                        <input
                          type="number"
                          value={field.validation?.minLength || ''}
                          onChange={(e) =>
                            handleUpdateField(idx, {
                              validation: {
                                ...field.validation,
                                minLength: e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : undefined,
                              },
                            })
                          }
                          className="w-14 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-200"
                          placeholder="0"
                        />
                      </div>
                    )}
                  </div>

                  {/* Select Options Config */}
                  {field.type === 'select' && (
                    <div className="space-y-1.5 pt-1 border-t border-zinc-800/60">
                      <label className="block text-[11px] text-zinc-400">
                        Options (comma-separated or label:value)
                      </label>
                      <input
                        type="text"
                        value={
                          field.options
                            ? field.options
                                .map((opt) =>
                                  typeof opt === 'string'
                                    ? opt
                                    : `${opt.label}:${opt.value}`
                                )
                                .join(', ')
                            : ''
                        }
                        onChange={(e) => {
                          const raw = e.target.value;
                          const parsedOptions = raw
                            .split(',')
                            .map((item) => item.trim())
                            .filter(Boolean)
                            .map((item) => {
                              if (item.includes(':')) {
                                const [l, v] = item.split(':');
                                return { label: l.trim(), value: v.trim() };
                              }
                              return { label: item, value: item.toLowerCase().replace(/\s+/g, '_') };
                            });
                          handleUpdateField(idx, { options: parsedOptions });
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 focus:outline-none focus:border-accent text-[11px]"
                        placeholder="Option 1:opt1, Option 2:opt2"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
