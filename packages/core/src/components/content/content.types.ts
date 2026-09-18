import React from 'react';
import type { ContentBlock, ContentInput } from '../../content/content.schema';

export interface ContentComponentOverrides {
  paragraph?: React.ComponentType<{ block: Extract<ContentBlock, { type: 'paragraph' }>; className?: string }>;
  heading?: React.ComponentType<{ block: Extract<ContentBlock, { type: 'heading' }>; className?: string }>;
  list?: React.ComponentType<{ block: Extract<ContentBlock, { type: 'list' }>; className?: string }>;
  link?: React.ComponentType<{ block: Extract<ContentBlock, { type: 'link' }>; className?: string }>;
  callout?: React.ComponentType<{ block: Extract<ContentBlock, { type: 'callout' }>; className?: string }>;
  code?: React.ComponentType<{ block: Extract<ContentBlock, { type: 'code' }>; className?: string }>;
}

export interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: ContentInput;
  components?: ContentComponentOverrides;
  asChild?: boolean;
}
