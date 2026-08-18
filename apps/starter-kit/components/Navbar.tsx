'use client';

import { Navbar } from '@contextual-ui/core';

interface CustomNavbarProps {
  data: {
    navbar?: {
      links: Array<{ id: string; label: string; href: string }>;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

export function CustomNavbar({ data }: CustomNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center px-6 shadow-sm">
      <div className="max-w-3xl w-full mx-auto flex justify-between items-center">
        <Navbar.Root data={data.navbar} className="flex justify-between items-center w-full">
          <Navbar.Brand className="font-bold text-lg text-slate-900 no-underline flex items-center gap-2.5">
            <span className="bg-blue-600 text-white w-7 h-7 inline-flex items-center justify-center rounded-lg text-sm font-semibold shadow-sm">
              C
            </span>
            Contextual UI
          </Navbar.Brand>
          <Navbar.Content className="flex gap-6 items-center">
            {data.navbar?.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-slate-600 hover:text-blue-600 no-underline text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/components"
              className="text-emerald-600 hover:text-emerald-700 no-underline text-sm font-semibold transition-colors"
            >
              Components
            </a>
          </Navbar.Content>
        </Navbar.Root>
      </div>
    </header>
  );
}
