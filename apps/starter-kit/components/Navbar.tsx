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
            <img
              src="/images/contextual-ui-logo.png"
              alt="Contextual UI Logo"
              className="w-7 h-7 rounded-md object-contain shadow-sm text-silver bg-zinc-950 border border-base"
            />
            Contextual UI
          </Navbar.Brand>
          <Navbar.Content className="flex gap-6 items-center">
            {data.navbar?.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="hover:text-silver no-underline text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/components"
              className="text-accent hover:text-accent/90 no-underline text-sm font-semibold transition-colors"
            >
              Components
            </a>
          </Navbar.Content>
        </Navbar.Root>
      </div>
    </header>
  );
}
