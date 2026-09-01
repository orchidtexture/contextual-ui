'use client';

export default function StudioFormsPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Studio Top Header Bar */}
      <header className="h-12 border-b border-zinc-800/80 bg-zinc-900/60 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Studio
          </span>
          <span className="text-xs text-zinc-400 font-mono">/</span>
          <h1 className="text-sm font-medium text-zinc-200">Forms Playground & Generator</h1>
        </div>
      </header>

      {/* 3-Pane Workspace Container */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden bg-zinc-950 divide-x divide-zinc-800/80">
        {/* Left Pane: Config & File Tree */}
        <section className="col-span-3 flex flex-col h-full overflow-y-auto bg-zinc-900/30 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            Configuration & Files
          </h2>
          <p className="text-xs text-zinc-500">Left pane builder controls will go here.</p>
        </section>

        {/* Middle Pane: Code Editor & Console */}
        <section className="col-span-5 flex flex-col h-full overflow-hidden bg-zinc-950">
          <div className="flex-1 overflow-auto p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Generated Code
            </h2>
            <p className="text-xs text-zinc-500">Editor with PrismJS code highlighting will go here.</p>
          </div>
          <div className="h-44 border-t border-zinc-800/80 bg-zinc-900/50 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Console Output
            </h2>
            <p className="text-xs text-zinc-500">Form submit payloads will appear here.</p>
          </div>
        </section>

        {/* Right Pane: Live Visualizer */}
        <section className="col-span-4 flex flex-col h-full overflow-y-auto bg-zinc-900/20 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            Live Preview
          </h2>
          <p className="text-xs text-zinc-500">Interactive form visualizer will render here.</p>
        </section>
      </div>
    </div>
  );
}
