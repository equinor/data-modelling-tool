//todo use attribute_type blueprint.
export function isPrimitive(type: string): boolean {
  return ['string', 'number', 'integer', 'number', 'boolean'].includes(type)
}
