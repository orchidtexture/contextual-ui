import React from 'react';
import { renderToString } from 'react-dom/server';
import { ContextualSite } from 'contextual-ui';
import type { SiteData } from '@/data/site.server';

export function renderSiteComponent(
  ui: React.ReactElement,
  data?: SiteData,
  options?: { disableJsonLdScript?: boolean }
): string {
  return renderToString(
    <ContextualSite data={data} options={{ disableJsonLdScript: options?.disableJsonLdScript ?? true }}>
      {ui}
    </ContextualSite>
  );
}

export function extractVisibleText(html: string): string {
  // Strip script and style blocks completely
  const withoutScriptsAndStyles = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');

  // Strip all HTML tags
  const withoutTags = withoutScriptsAndStyles.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  const decoded = withoutTags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');

  // Normalize whitespace
  return decoded.replace(/\s+/g, ' ').trim();
}

export function extractJsonLdScripts(html: string): Array<any> {
  const scripts: any[] = [];
  const scriptRegex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = scriptRegex.exec(html)) !== null) {
    const rawContent = match[1].trim();
    if (rawContent) {
      try {
        scripts.push(JSON.parse(rawContent));
      } catch (err) {
        throw new Error(`Failed to parse application/ld+json script: ${rawContent}\n${err}`);
      }
    }
  }
  return scripts;
}

export function extractAllJsonLdEntities(html: string): Array<Record<string, any>> {
  const scripts = extractJsonLdScripts(html);
  const entities: Record<string, any>[] = [];
  for (const script of scripts) {
    if (Array.isArray(script)) {
      entities.push(...script);
    } else if (script && typeof script === 'object') {
      if (Array.isArray(script['@graph'])) {
        entities.push(...script['@graph']);
      } else {
        entities.push(script);
      }
    }
  }
  return entities;
}

export function cloneSiteData(data: SiteData): SiteData {
  return JSON.parse(JSON.stringify(data));
}
