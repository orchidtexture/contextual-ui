'use client';

import { Navbar } from '@contextual-ui/core';
import type { SiteData } from '@/data/site.server';

interface CustomNavbarProps {
  data: SiteData;
}

export function CustomNavbar({ data }: CustomNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 backdrop-blur-md border-b border-base z-50 flex items-center px-6 md:px-16 shadow-sm">
      <div className="w-full mx-auto flex justify-between items-center">
        <Navbar.Root data={data.navbar} className="w-full relative">
          <div className="flex justify-between items-center w-full">
            <Navbar.Brand className="font-bold text-lg no-underline flex items-center gap-2.5">
              <img
                src="/images/contextual-ui-logo.png"
                alt="Contextual UI Logo"
                className="w-7 h-7 rounded-md object-contain shadow-sm text-silver bg-zinc-950 border border-base"
              />
              Contextual UI
            </Navbar.Brand>
            <Navbar.Content className="hidden md:flex gap-6 items-center">
              {data.navbar?.links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="hover:text-silver no-underline text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </Navbar.Content>
            <Navbar.Toggle className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 focus:outline-none cursor-pointer" />
          </div>

          <Navbar.Menu className="absolute top-16 left-[-24px] right-[-24px] md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-base p-6 flex flex-col gap-4 shadow-2xl">
            {data.navbar?.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="hover:text-silver no-underline text-base font-medium transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </Navbar.Menu>
        </Navbar.Root>
      </div>
    </header>
  );
}
