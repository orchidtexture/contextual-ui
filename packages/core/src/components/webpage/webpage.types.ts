import type React from 'react';
import type { WebpageData, WebpageItem } from './webpage.schema';

export interface WebPageProps extends React.HTMLAttributes<HTMLDivElement> {
  app?: {
    getGraph: (options?: any) => Promise<any>;
  };
  graph?: any;
  id?: string;
  data?: Partial<WebpageItem> | WebpageData;
  name?: string;
  url?: string;
  description?: string;
  isPartOf?: string;
  hasPart?: string[];
  inLanguage?: string;
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  disableJsonLdScript?: boolean;
}


