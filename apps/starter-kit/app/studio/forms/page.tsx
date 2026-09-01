'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { FormEntity, FormField } from 'contextual-ui';
import {
  PRESET_FORMS,
  type PresetOption,
  type ConsoleLog,
  type PromptOptions,
  DEFAULT_PROMPT_OPTIONS,
} from './types';
import { generateAiPrompt } from './generators';
import { StudioHeader } from './components/StudioHeader';
import { PromptTweaker } from './components/PromptTweaker';
import { FieldBuilder } from './components/FieldBuilder';
import { FormMetaEditor } from './components/FormMetaEditor';
import { ConsoleOutput } from './components/ConsoleOutput';
import { VisualizerPane } from './components/VisualizerPane';

export default function StudioFormsPage() {
  // 1. Studio State
  const [currentPreset, setCurrentPreset] = useState<PresetOption>(PRESET_FORMS[0]);
  const [form, setForm] = useState<FormEntity>(PRESET_FORMS[0].form);
  const [promptOptions, setPromptOptions] = useState<PromptOptions>(DEFAULT_PROMPT_OPTIONS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedAiPrompt, setCopiedAiPrompt] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [formResetKey, setFormResetKey] = useState(0);

  // Initial log on mount to avoid SSR / Client locale hydration mismatch
  useEffect(() => {
    setConsoleLogs([
      {
        id: 'init-1',
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        title: 'Studio Playground Initialized',
        payload: {
          preset: PRESET_FORMS[0].name,
          endpoint: PRESET_FORMS[0].form.endpoint,
          actionType: PRESET_FORMS[0].form.actionType,
          fieldsCount: PRESET_FORMS[0].form.fields.length,
        },
      },
    ]);
  }, []);

  // 2. Preset Selection Handler
  const handleSelectPreset = (preset: PresetOption) => {
    setCurrentPreset(preset);
    setForm(JSON.parse(JSON.stringify(preset.form)));
    setFormResetKey((k) => k + 1);
    handleAddLog({
      type: 'info',
      title: `Loaded Preset: ${preset.name}`,
      payload: { description: preset.description, fields: preset.form.fields.map((f) => f.name) },
    });
  };

  // 3. Reset to Current Preset Default
  const handleResetToDefault = () => {
    setForm(JSON.parse(JSON.stringify(currentPreset.form)));
    setPromptOptions(DEFAULT_PROMPT_OPTIONS);
    setFormResetKey((k) => k + 1);
    handleAddLog({
      type: 'info',
      title: `Reset to default (${currentPreset.name})`,
      payload: null,
    });
  };

  // 4. Form Meta Updates
  const handleUpdateFormMeta = (updates: Partial<FormEntity>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  // 5. Form Fields Updates
  const handleUpdateFields = (fields: FormField[]) => {
    setForm((prev) => ({ ...prev, fields }));
  };

  // 6. Prompt Options Updates
  const handleUpdatePromptOptions = (updates: Partial<PromptOptions>) => {
    setPromptOptions((prev) => ({ ...prev, ...updates }));
  };

  // 7. Console Log Dispatcher
  const handleAddLog = useCallback(
    (log: Omit<ConsoleLog, 'id' | 'timestamp'>) => {
      const newEntry: ConsoleLog = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toLocaleTimeString(),
        ...log,
      };
      setConsoleLogs((prev) => [newEntry, ...prev]);
    },
    []
  );

  const handleClearLogs = () => {
    setConsoleLogs([]);
  };

  // 8. Reactive AI Prompt Generator
  const aiPromptCode = useMemo(
    () => generateAiPrompt(form, promptOptions),
    [form, promptOptions]
  );

  // 9. Copy AI Prompt Action
  const handleCopyAiPrompt = () => {
    navigator.clipboard.writeText(aiPromptCode);
    setCopiedAiPrompt(true);
    handleAddLog({
      type: 'success',
      title: 'Copied AI Prompt to Clipboard',
      payload: `Target: ${promptOptions.aiTarget.toUpperCase()} | Integration: ${promptOptions.integration}`,
    });
    setTimeout(() => setCopiedAiPrompt(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Studio Top Action Bar */}
      <StudioHeader
        selectedPresetId={currentPreset.id}
        onSelectPreset={handleSelectPreset}
        onOpenSettings={() => setIsSettingsOpen((prev) => !prev)}
        onCopyAiPrompt={handleCopyAiPrompt}
        copiedAiPrompt={copiedAiPrompt}
        onResetToDefault={handleResetToDefault}
      />

      {/* 3-Pane Workspace */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden bg-zinc-950 divide-x divide-zinc-800/80">
        {/* Left Pane (Col 3): Prompt Tweaker (Top) + Runtime Console (Bottom) */}
        <section className="col-span-12 lg:col-span-3 flex flex-col h-full overflow-hidden bg-zinc-950">
          {/* Top Half: Prompt Tweaker */}
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-900/30">
            <PromptTweaker
              promptOptions={promptOptions}
              onChangeOptions={handleUpdatePromptOptions}
              onCopyPrompt={handleCopyAiPrompt}
              copied={copiedAiPrompt}
              generatedPrompt={aiPromptCode}
            />
          </div>

          {/* Bottom Half: Runtime Console */}
          <div className="h-56 shrink-0">
            <ConsoleOutput
              logs={consoleLogs}
              onClear={handleClearLogs}
            />
          </div>
        </section>

        {/* Center Pane (Col 6): Full-Height Interactive Live Form Visualizer */}
        <section className="col-span-12 lg:col-span-6 flex flex-col h-full overflow-hidden bg-zinc-900/10">
          <VisualizerPane
            form={form}
            onAddLog={handleAddLog}
            resetTrigger={formResetKey}
          />
        </section>

        {/* Right Pane (Col 3): Form Configuration (Top) + Form Fields Manager */}
        <section className="col-span-12 lg:col-span-3 flex flex-col h-full overflow-y-auto bg-zinc-900/40 p-4 space-y-4">
          <FormMetaEditor
            form={form}
            isOpen={isSettingsOpen}
            onToggle={() => setIsSettingsOpen((prev) => !prev)}
            onChange={handleUpdateFormMeta}
          />

          <FieldBuilder
            fields={form.fields}
            onChange={handleUpdateFields}
          />
        </section>
      </div>
    </div>
  );
}
