import { Blueprint } from '../types'

export function castValues(blueprint: Blueprint, entity: any) {
  const newEntity = { ...entity }
  blueprint.attributes.forEach(attribute => {
    const key = attribute.name
    const value = (newEntity as any)[key]
    if (value) {
      if (typeof value !== attribute.type) {
        //cast
        switch (attribute.type) {
          case 'boolean':
            if (value) {
              ;(newEntity as any)[key] = Boolean(value)
            }
            break
          case 'number':
          case 'integer':
            if (value) {
              ;(newEntity as any)[key] = Number(value)
            }
        }
      }
    }
  })
  return newEntity
}
