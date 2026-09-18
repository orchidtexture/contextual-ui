import React from 'react';
import { renderToString } from 'react-dom/server';
import * as cheerio from 'cheerio';
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

/**
 * Parses raw HTML into a Cheerio root instance for structured DOM assertions.
 */
export function parseHtml(html: string): cheerio.CheerioAPI {
  return cheerio.load(html);
}

/**
 * Extracts visible/rendered text from HTML using an HTML parser.
 * Excludes scripts, styles, and noscript elements.
 * Decodes all HTML entities and normalizes whitespace.
 */
export function extractVisibleText(html: string, selector?: string): string {
  const $ = cheerio.load(html);
  $('script, style, noscript').remove();
  const root = selector ? $(selector) : $('body').length ? $('body') : $.root();
  const text = root.text();
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Extracts raw DOM text from HTML, including tabbed or inactive panels,
 * excluding scripts and styles.
 */
export function extractDomText(html: string, selector?: string): string {
  const $ = cheerio.load(html);
  $('script, style, noscript').remove();
  const root = selector ? $(selector) : $.root();
  return root.text().replace(/\s+/g, ' ').trim();
}

/**
 * Parses EVERY application/ld+json script tag in the HTML,
 * including standalone objects and standalone arrays.
 */
export function extractJsonLdScripts(html: string): Array<any> {
  const $ = cheerio.load(html);
  const scripts: any[] = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    const rawContent = $(el).text().trim();
    if (rawContent) {
      try {
        scripts.push(JSON.parse(rawContent));
      } catch (err) {
        throw new Error(`Failed to parse application/ld+json script tag: ${rawContent}\n${err}`);
      }
    }
  });

  return scripts;
}

/**
 * Flattens all Schema.org entities across all application/ld+json scripts in the HTML,
 * unpacking standalone objects, standalone arrays, and top-level @graph arrays.
 */
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
