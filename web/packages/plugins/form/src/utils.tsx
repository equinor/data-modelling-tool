export const isArray = (dimensions: string) => {
  return dimensions && dimensions === '*'
}

export const isPrimitive = (attributeType: string): boolean => {
  return ['string', 'number', 'integer', 'boolean'].includes(
    attributeType as string
  )
}
