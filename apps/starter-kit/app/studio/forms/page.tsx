'use client';

import React, { useState, useMemo, useCallback } from 'react';
import type { FormEntity, FormField } from 'contextual-ui';
import {
  PRESET_FORMS,
  type PresetOption,
  type StudioFileType,
  type ConsoleLog,
} from './types';
import {
  generateSchema,
  generateComponent,
  generateApiRoute,
  generateAiPrompt,
} from './generators';
import { StudioHeader } from './components/StudioHeader';
import { FileTree } from './components/FileTree';
import { FieldBuilder } from './components/FieldBuilder';
import { FormMetaEditor } from './components/FormMetaEditor';
import { CodeViewer } from './components/CodeViewer';
import { ConsoleOutput } from './components/ConsoleOutput';
import { VisualizerPane } from './components/VisualizerPane';

export default function StudioFormsPage() {
  // 1. Studio State
  const [currentPreset, setCurrentPreset] = useState<PresetOption>(PRESET_FORMS[0]);
  const [form, setForm] = useState<FormEntity>(PRESET_FORMS[0].form);
  const [activeFile, setActiveFile] = useState<StudioFileType>('schema.ts');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedAiPrompt, setCopiedAiPrompt] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);

  // Initial log on mount to avoid SSR / Client locale hydration mismatch
  React.useEffect(() => {
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
    handleAddLog({
      type: 'info',
      title: `Loaded Preset: ${preset.name}`,
      payload: { description: preset.description, fields: preset.form.fields.map((f) => f.name) },
    });
  };

  // 3. Reset to Current Preset Default
  const handleResetToDefault = () => {
    setForm(JSON.parse(JSON.stringify(currentPreset.form)));
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

  // 6. Console Log Dispatcher
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

  // 7. Reactive Code Generators
  const schemaCode = useMemo(() => generateSchema(form), [form]);
  const componentCode = useMemo(() => generateComponent(form), [form]);
  const apiRouteCode = useMemo(() => generateApiRoute(form), [form]);
  const aiPromptCode = useMemo(() => generateAiPrompt(form), [form]);

  // Active Code String
  const activeCode = useMemo(() => {
    switch (activeFile) {
      case 'schema.ts':
        return schemaCode;
      case 'FormComponent.tsx':
        return componentCode;
      case 'route.ts':
        return apiRouteCode;
      case 'ai-prompt.txt':
        return aiPromptCode;
      default:
        return schemaCode;
    }
  }, [activeFile, schemaCode, componentCode, apiRouteCode, aiPromptCode]);

  // 8. Copy AI Prompt Action
  const handleCopyAiPrompt = () => {
    navigator.clipboard.writeText(aiPromptCode);
    setCopiedAiPrompt(true);
    handleAddLog({
      type: 'success',
      title: 'Copied AI Prompt to Clipboard',
      payload: 'Paste this prompt into Cursor, Claude Code, or ChatGPT to scaffold your form.',
    });
    setTimeout(() => setCopiedAiPrompt(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Studio Top Action Bar */}
      <StudioHeader
        selectedPresetId={currentPreset.id}
        onSelectPreset={handleSelectPreset}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onCopyAiPrompt={handleCopyAiPrompt}
        copiedAiPrompt={copiedAiPrompt}
        onResetToDefault={handleResetToDefault}
      />

      {/* 3-Pane Workspace */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden bg-zinc-950 divide-x divide-zinc-800/80">
        {/* Left Pane (Col 3): File Tree & Visual Field Builder */}
        <section className="col-span-12 md:col-span-3 flex flex-col h-full overflow-y-auto bg-zinc-900/40 p-4 space-y-6">
          <FileTree
            activeFile={activeFile}
            onSelectFile={setActiveFile}
            formId={form.id}
            endpoint={form.endpoint}
          />

          <FieldBuilder
            fields={form.fields}
            onChange={handleUpdateFields}
          />
        </section>

        {/* Middle Pane (Col 5): Code Viewer & Live Interactive Console */}
        <section className="col-span-12 md:col-span-5 flex flex-col h-full overflow-hidden bg-zinc-950">
          {/* Top Half: Code Viewer */}
          <div className="flex-1 overflow-hidden">
            <CodeViewer
              activeFile={activeFile}
              code={activeCode}
              formId={form.id}
            />
          </div>

          {/* Bottom Half: Console Output */}
          <div className="h-52 shrink-0">
            <ConsoleOutput
              logs={consoleLogs}
              onClear={handleClearLogs}
            />
          </div>
        </section>

        {/* Right Pane (Col 4): Interactive Form Visualizer */}
        <section className="col-span-12 md:col-span-4 flex flex-col h-full overflow-hidden bg-zinc-900/20">
          <VisualizerPane
            form={form}
            onAddLog={handleAddLog}
          />
        </section>
      </div>

      {/* Form Metadata & Configuration Settings Modal */}
      <FormMetaEditor
        form={form}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onChange={handleUpdateFormMeta}
      />
    </div>
  );
}
