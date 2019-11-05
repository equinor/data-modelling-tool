import { Blueprint } from '../types'

export function castValues(blueprint: Blueprint, entity: any) {
  blueprint.attributes.forEach(attribute => {
    const key = attribute.name
    const value = (entity as any)[key]
    if (typeof value !== attribute.type) {
      //cast
      switch (attribute.type) {
        case 'boolean':
          ;(entity as any)[key] = Boolean(value)
          break
        case 'number':
        case 'integer':
          ;(entity as any)[key] = Number(value)
      }
    }
  })
  return entity
}
