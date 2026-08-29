import type React from 'react';
import type { WebpageData } from './webpage.schema';

export interface WebPageProps extends React.HTMLAttributes<HTMLDivElement> {
  app?: {
    getGraph: (options?: any) => Promise<any>;
  };
  graph?: any;
  data?: WebpageData;
  name?: string;
  url?: string;
  description?: string;
  isPartOf?: string;
  hasPart?: string[];
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  disableJsonLdScript?: boolean;
}
