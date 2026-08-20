'use client';

import { Navbar } from '@contextual-ui/core';
import type { SiteData } from '@/data/site.server';

interface CustomNavbarProps {
  data: SiteData;
}

export function CustomNavbar({ data }: CustomNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 backdrop-blur-md border-b border-base z-50 flex items-center px-6 shadow-sm">
      <div className="max-w-3xl w-full mx-auto flex justify-between items-center">
        <Navbar.Root data={data.navbar} className="flex justify-between items-center w-full">
          <Navbar.Brand className="font-bold text-lg no-underline flex items-center gap-2.5">
            <span className="bg-green-400 text-zinc-950 w-7 h-7 inline-flex items-center justify-center rounded-lg text-sm font-semibold shadow-sm">
              {'C'}
            </span>
            Contextual UI
          </Navbar.Brand>
          <Navbar.Content className="flex gap-6 items-center">
            {data.navbar?.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="hover:text-green-500 no-underline text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/components"
              className="text-yellow-400 hover:text-yellow-600 no-underline text-sm font-semibold transition-colors"
            >
              Components
            </a>
          </Navbar.Content>
        </Navbar.Root>
      </div>
    </header>
  );
}
