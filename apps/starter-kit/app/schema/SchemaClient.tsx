'use client';

import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';

interface SchemaClientProps {
  schemaSource: string;
  graphJson: any;
}

export function SchemaClient({ schemaSource, graphJson }: SchemaClientProps) {
  const [copied, setCopied] = useState(false);
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
    <div className="pt-12">
      <main className="min-h-screen p-16 mx-auto space-y-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Schema & Knowledge Graph</h1>
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
    </div>
  );
}
