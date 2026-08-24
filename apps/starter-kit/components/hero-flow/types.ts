export type FlowChannel = 'all' | 'ui' | 'graph' | 'ai';

export interface FlowNodeData {
  id: string;
  stage: 'source' | 'schema' | 'engine' | 'output';
  channel?: 'ui' | 'graph' | 'ai';
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  color: string;
  accentClass: string;
  borderClass: string;
  bgGlowClass: string;
  tags: string[];
  description: string;
  codeSnippet: {
    language: 'typescript' | 'json';
    filename: string;
    code: string;
  };
  details: {
    label: string;
    value: string;
  }[];
}

export interface FlowEdgeData {
  channel?: 'ui' | 'graph' | 'ai';
  color?: string;
  isHighlighted?: boolean;
  isActive?: boolean;
  duration?: string;
}
