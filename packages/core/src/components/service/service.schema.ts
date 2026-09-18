import { z } from 'zod';
import { cx } from '../../registry/defineSchema';

/**
 * Schema for an individual Service entity.
 */
export const ServiceItemSchema = z.object({
  id: cx(z.string().min(1, 'Service ID is required'), { label: 'Service ID', widget: 'text' }),
  name: cx(z.string().min(1, 'Service Name is required'), { label: 'Service Name', widget: 'text' }),
  description: cx(z.string().optional(), { label: 'Description', widget: 'textarea' }),
  serviceType: cx(z.string().optional(), { label: 'Service Type', widget: 'text' }),
  areaServed: cx(z.string().optional(), { label: 'Area Served', widget: 'text' }),
  audience: cx(z.string().optional(), { label: 'Audience', widget: 'text' }),
  url: cx(z.string().optional(), { label: 'Service URL', widget: 'text' }),
  image: cx(z.string().optional(), { label: 'Image URL', widget: 'text' }),
  provider: cx(z.union([z.string(), z.record(z.string(), z.any())]).optional(), { label: 'Provider Reference', widget: 'text' }),
  pageId: cx(z.string().optional(), { label: 'Page ID', widget: 'text' }),
});
export type ServiceItem = z.infer<typeof ServiceItemSchema>;

/**
 * Service registry schema: single service or an array of services.
 */
export const ServiceDataSchema = z.union([
  ServiceItemSchema,
  z.array(ServiceItemSchema),
]);
export type ServiceData = z.infer<typeof ServiceDataSchema>;
