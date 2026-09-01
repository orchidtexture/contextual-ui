'use client';

import { Navbar } from 'contextual-ui';
import type { NavbarData } from 'contextual-ui';

interface CustomNavbarProps {
  data?: NavbarData;
}

export function CustomNavbar({ data }: CustomNavbarProps = {}) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 backdrop-blur-md border-b border-base z-50 flex items-center px-6 md:px-16 shadow-sm">
      <div className="w-full mx-auto flex justify-between items-center">
        <Navbar.Root data={data} className="w-full relative">
          <div className="flex justify-between items-center w-full">
            <Navbar.Brand className="font-semibold font-mono text-base no-underline flex items-center gap-2.5">
              {(brand) => (
                <>
                  <img
                    src={brand?.logo || '/images/onigiri_logo.svg'}
                    alt={brand?.name || 'Contextual Site Logo'}
                    className="w-7 h-7 rounded-md object-contain shadow-sm text-silver"
                  />
                  {brand?.name || 'Contextual'}
                </>
              )}
            </Navbar.Brand>
            <Navbar.Links
              className="hidden md:flex gap-6 items-center"
              linkClassName="hover:text-silver no-underline text-sm font-medium transition-colors"
            >
              <Navbar.Link
                href="https://github.com/orchidtexture/contextual-ui"
                external
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-colors ml-2"
                aria-label="GitHub Repository"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>GitHub</span>
              </Navbar.Link>
            </Navbar.Links>
            <Navbar.Toggle className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 focus:outline-none cursor-pointer" />
          </div>

          <Navbar.Menu
            className="absolute left-[-24px] right-[-24px] md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-base p-6 flex flex-col gap-4 shadow-2xl"
            linkClassName="hover:text-silver no-underline text-base font-medium transition-colors py-1"
          >
            <Navbar.Link
              href="https://github.com/orchidtexture/contextual-ui"
              external
              className="flex items-center gap-2 pt-3 mt-1 border-t border-zinc-800 text-zinc-300 hover:text-white transition-colors text-base font-medium"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub Repository</span>
            </Navbar.Link>
          </Navbar.Menu>
        </Navbar.Root>
      </div>
    </header>
  );
}

