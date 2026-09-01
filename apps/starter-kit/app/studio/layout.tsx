import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio Playground - Contextual UI',
  description: 'Interactive playground, visual builder, and code generator for Contextual UI Forms and components.',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-16 h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      {children}
    </div>
  );
}
