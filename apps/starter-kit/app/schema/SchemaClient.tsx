'use client';

import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';
import { SchemaGraph } from '@/components/schema-graph';

interface SchemaClientProps {
  schemaSource: string;
  graphJson: any;
}

export function SchemaClient({ schemaSource, graphJson }: SchemaClientProps) {
  const [copied, setCopied] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const graphString = JSON.stringify(graphJson, null, 2);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(graphString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-12 pb-32">
      <main className="min-h-screen p-16 mx-auto space-y-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-4">Schema & Knowledge Graph</h1>
          <p className="text-zinc-400">
            Contextual UI uses a Single Source of Truth (SSOT) schema definition to automatically compile and serve a referentially-linked Schema.org `@graph` for search engines and AI agents.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* SSOT Schema Definition Section */}
          <section className="border border-base rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Single Source of Truth Schema</h2>
              <span className="p-2 border border-base rounded-md text-xs text-silver w-auto">site.schema.ts</span>
            </div>
            <p className="my-6 text-sm leading-relaxed text-zinc-300">
              Central schema definition combining standard Zod types with pre-built schema registries (`websiteRegistry`, `faqRegistry`, `navbarRegistry`) that power both runtime UI and semantic metadata.
            </p>
            <pre className="!bg-zinc-950 !text-zinc-100 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-base shadow-inner">
              <code className="language-typescript">
                {schemaSource}
              </code>
            </pre>
          </section>

          {/* Global Knowledge Graph JSON Section */}
          <section className="border border-base rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Compiled Knowledge Graph JSON</h2>
              <a href="/api/graph.json" target="_blank" className="p-2 border border-base rounded-md text-xs text-silver hover:bg-zinc-900 w-auto">/api/graph.json &rarr;</a>
            </div>
            <p className="text-sm leading-relaxed text-zinc-300 my-6">
              The generated Schema.org `@graph` compiled from the SSOT schema and connector data, served sitewide for search crawlers and AI agents.
            </p>
            <pre className="!bg-zinc-950 !text-zinc-100 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-base shadow-inner max-h-[300px]">
              <code className="language-json">
                {graphString}
              </code>
            </pre>
          </section>
        </div>
      </main>

      {/* Fixed Bottom Drawer & Trigger Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto shadow-2xl rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
          {/* Slide-up Graph Container */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden bg-zinc-950 ${
              isGraphOpen ? 'max-h-[650px] opacity-100' : 'max-h-0 opacity-0 p-0'
            }`}
          >
            <SchemaGraph graphJson={graphJson} />
          </div>

          {/* Full-Width Fixed Trigger Button */}
          <button
            onClick={() => setIsGraphOpen(!isGraphOpen)}
            className={
              `w-full py-4 px-6 bg-accent hover:bg-accent/90 flex items-center justify-between text-white font-semibold transition-colors duration-200 group
              ${isGraphOpen && 'bg-accent/50 hover:bg-accent/70'}`
            }
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
              <span className="text-sm sm:text-base">Interactive Knowledge Graph</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm group-hover:text-zinc-200 transition-colors font-mono">
              <span>{isGraphOpen ? 'Hide Graph' : 'Show Graph'}</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  isGraphOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
