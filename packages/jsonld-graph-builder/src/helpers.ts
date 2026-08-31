import type {
  PropertyValueSpecOptions,
  PotentialActionOptions,
  JsonLdObject,
} from './types';

/**
 * Helper to generate a standardized relative or absolute @id identifier.
 *
 * @example
 * createId('article', 'my-first-post') // -> '#article:my-first-post'
 * createId('organization', 'main')     // -> '#organization:main'
 * createId('website')                  // -> '#website'
 */
export function createId(type: string, id?: string): string {
  const normalizedType = type.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!id) {
    return `#${normalizedType}`;
  }
  if (id.startsWith('#') || id.startsWith('/') || id.startsWith('http://') || id.startsWith('https://')) {
    return id;
  }
  return `#${normalizedType}:${id}`;
}

/**
 * Helper to create a JSON-LD reference node pointer `{ "@id": "..." }`.
 *
 * @example
 * refersTo('organization', 'main') // -> { "@id": "#organization:main" }
 */
export function refersTo(type: string, id?: string): { '@id': string } {
  return {
    '@id': createId(type, id),
  };
}

/**
 * Infers regex pattern for standard semantic input types.
 */
export function inferValuePattern(type?: string): string | undefined {
  if (!type) return undefined;
  switch (type.toLowerCase()) {
    case 'email':
      return '^.+@.+\\..+$';
    case 'tel':
    case 'phone':
      return '^\\+?[0-9\\s\\-\\(\\)]{7,20}$';
    case 'url':
      return '^https?:\\/\\/.+';
    case 'number':
      return '^-?\\d+(\\.\\d+)?$';
    default:
      return undefined;
  }
}

/**
 * Builds a Schema.org PropertyValueSpecification entity for a form field.
 */
export function createPropertyValueSpecification(
  options: PropertyValueSpecOptions
): JsonLdObject {
  const spec: JsonLdObject = {
    '@type': 'PropertyValueSpecification',
    valueName: options.valueName,
    valueRequired: options.valueRequired ?? false,
  };

  if (options.valuePattern) {
    spec.valuePattern = options.valuePattern;
  }

  if (options.valueMinLength !== undefined) {
    spec.valueMinLength = options.valueMinLength;
  }

  if (options.valueMaxLength !== undefined) {
    spec.valueMaxLength = options.valueMaxLength;
  }

  if (options.minValue !== undefined) {
    spec.minValue = options.minValue;
  }

  if (options.maxValue !== undefined) {
    spec.maxValue = options.maxValue;
  }

  if (options.defaultValue !== undefined) {
    spec.defaultValue = options.defaultValue;
  }

  if (options.description) {
    spec.description = options.description;
  }

  if (options.readonlyValue !== undefined) {
    spec.readonlyValue = options.readonlyValue;
  }

  if (options.multipleValues !== undefined) {
    spec.multipleValues = options.multipleValues;
  }

  if (options.valueOption && options.valueOption.length > 0) {
    spec.valueOption = options.valueOption.map((opt) =>
      typeof opt === 'string' ? opt : opt.value
    );
  }

  return spec;
}

/**
 * Builds a Schema.org PotentialAction entity (e.g. ContactAction, SearchAction, SubscribeAction).
 */
export function createPotentialAction(
  options: PotentialActionOptions
): JsonLdObject {
  const actionType = options.actionType || 'Action';
  const actionId = options.id ? createId('action', options.id) : undefined;

  let targetObj: JsonLdObject;
  if (typeof options.target === 'string') {
    targetObj = {
      '@type': 'EntryPoint',
      urlTemplate: options.target,
      httpMethod: 'POST',
      contentType: 'application/json',
    };
  } else {
    targetObj = {
      '@type': 'EntryPoint',
      urlTemplate: options.target.urlTemplate,
      httpMethod: options.target.httpMethod || 'POST',
      contentType: options.target.contentType || 'application/json',
      ...(options.target.encodingType ? { encodingType: options.target.encodingType } : {}),
      ...(options.target.actionPlatform ? { actionPlatform: options.target.actionPlatform } : {}),
    };
  }

  const action: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': actionType,
    ...(actionId ? { '@id': actionId } : {}),
    ...(options.name ? { name: options.name } : {}),
    ...(options.description ? { description: options.description } : {}),
    target: targetObj,
  };

  if (options.isPartOf) {
    action.isPartOf = typeof options.isPartOf === 'string'
      ? refersTo(options.isPartOf)
      : options.isPartOf;
  }

  if (options.object && options.object.length > 0) {
    action.object = options.object.map((item) =>
      createPropertyValueSpecification(item)
    );
  }

  if (options.result) {
    action.result = options.result;
  }

  return action;
}

