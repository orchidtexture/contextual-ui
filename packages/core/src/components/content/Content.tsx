'use client';

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { normalizeContentBlocks } from '../../content/content.utils';
import type { ContentProps } from './content.types';

export function Content({
  data,
  components,
  asChild = false,
  className,
  ...props
}: ContentProps) {
  const blocks = React.useMemo(() => normalizeContentBlocks(data), [data]);

  if (blocks.length === 0) {
    return null;
  }

  const renderedBlocks = blocks.map((block, index) => {
    switch (block.type) {
      case 'paragraph': {
        const Override = components?.paragraph;
        if (Override) {
          return <Override key={index} block={block} />;
        }
        return (
          <p
            key={index}
            data-contextual="content-paragraph"
            data-role={block.role}
            className={block.role === 'qualifier' || block.role === 'disclaimer' ? 'content-qualifier' : undefined}
          >
            {block.text}
          </p>
        );
      }

      case 'heading': {
        const Override = components?.heading;
        if (Override) {
          return <Override key={index} block={block} />;
        }
        const HeadingTag = (`h${block.level || 2}`) as keyof React.JSX.IntrinsicElements;
        return (
          <HeadingTag key={index} data-contextual="content-heading">
            {block.text}
          </HeadingTag>
        );
      }

      case 'list': {
        const Override = components?.list;
        if (Override) {
          return <Override key={index} block={block} />;
        }
        const ListTag = block.style === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag key={index} data-contextual="content-list">
            {block.items.map((item, itemIdx) => {
              if (typeof item === 'string') {
                return <li key={itemIdx}>{item}</li>;
              }
              return (
                <li key={item.id || itemIdx} data-role={item.role}>
                  {item.title && <strong>{item.title}: </strong>}
                  {item.text}
                </li>
              );
            })}
          </ListTag>
        );
      }

      case 'link': {
        const Override = components?.link;
        if (Override) {
          return <Override key={index} block={block} />;
        }
        return (
          <a
            key={index}
            href={block.href}
            target={block.external ? '_blank' : undefined}
            rel={block.external ? 'noopener noreferrer' : undefined}
            data-contextual="content-link"
          >
            {block.label}
          </a>
        );
      }

      case 'callout': {
        const Override = components?.callout;
        if (Override) {
          return <Override key={index} block={block} />;
        }
        return (
          <aside
            key={index}
            role="note"
            data-contextual="content-callout"
            data-variant={block.variant || 'info'}
          >
            {block.title && <strong>{block.title}</strong>}
            <p>{block.text}</p>
          </aside>
        );
      }

      case 'code': {
        const Override = components?.code;
        if (Override) {
          return <Override key={index} block={block} />;
        }
        return (
          <pre key={index} data-contextual="content-code">
            <code data-language={block.language}>{block.code}</code>
          </pre>
        );
      }

      default:
        return null;
    }
  });

  const Comp = asChild ? Slot : 'div';

  return (
    <Comp data-contextual="content-root" className={className} {...props}>
      {renderedBlocks}
    </Comp>
  );
}
