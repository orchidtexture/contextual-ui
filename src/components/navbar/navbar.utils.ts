import { NavbarData } from './navbar.schema';

/**
 * Exports plain data for internal AI agents or other integrations.
 */
export function exportAgentData(data: NavbarData) {
  return {
    brand: data.brand,
    links: data.links,
  };
}
