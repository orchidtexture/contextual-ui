'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Settings,
  Layers,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { PRESET_FORMS, type PresetOption } from '../types';

interface StudioHeaderProps {
  selectedPresetId: string;
  onSelectPreset: (preset: PresetOption) => void;
  onOpenSettings: () => void;
  onCopyAiPrompt: () => void;
  copiedAiPrompt: boolean;
  onResetToDefault: () => void;
}

export function StudioHeader({
  selectedPresetId,
  onSelectPreset,
  onOpenSettings,
  onResetToDefault,
}: StudioHeaderProps) {
  return (
    <header className="h-14 border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur px-4 md:px-6 flex items-center justify-between shrink-0">
      {/* Left: Branding & Preset Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
            Studio
          </span>
          <span className="text-xs text-zinc-500 font-mono">/</span>
          <h1 className="text-sm font-semibold text-zinc-200">AutoForm</h1>
        </div>

        {/* Preset Selector */}
        <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-zinc-800">
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-400 font-medium">Preset:</span>
          <select
            value={selectedPresetId}
            onChange={(e) => {
              const p = PRESET_FORMS.find((item) => item.id === e.target.value);
              if (p) onSelectPreset(p);
            }}
            className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-accent font-sans"
          >
            {PRESET_FORMS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onResetToDefault}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-lg border border-transparent hover:border-zinc-700 transition-colors"
          title="Reset form configuration"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
