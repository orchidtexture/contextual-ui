import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-base py-8 px-6 mt-auto bg-zinc-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span>Maintained by</span>
          <a
            href="https://tasuku.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-200 hover:text-accent font-semibold transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-accent"
          >
            Tasuku Studio
          </a>
        </div>
        <div className="flex items-center gap-6 text-zinc-400 text-xs">
          <a href="/docs" className="hover:text-zinc-200 transition-colors">
            Docs
          </a>
          <a href="/schema" className="hover:text-zinc-200 transition-colors">
            Schema Graph
          </a>
          <a
            href="/api/graph.json"
            target="_blank"
            className="hover:text-zinc-200 transition-colors"
          >
            /api/graph.json ↗
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
