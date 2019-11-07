import { Blueprint, BlueprintAttribute } from '../types'
import {
  getBlueprintFromType,
  isPrimitive,
  parseAttributeDefault,
} from '../pluginUtils'

export function generateTemplate(
  attributes: BlueprintAttribute[],
  types: Blueprint[]
) {
  const properties = {}
  attributes.forEach((attribute: BlueprintAttribute) => {
    appendJsonSchemaProperty(attribute, properties, types)
  })
  return {
    type: 'object',
    properties,
  }
}

/**
 *
 * @param attribute
 * @param container properties or items.
 */
function appendJsonSchemaProperty(
  attribute: BlueprintAttribute,
  container: any,
  blueprints: Blueprint[]
): void {
  let value = null
  if (isPrimitive(attribute.type)) {
    if (attribute.dimensions === '*') {
      value = {
        type: 'array',
        items: parseAttributeDefault(attribute),
      }
    } else {
      value = parseAttributeDefault(attribute)
    }
  } else {
    const properties = getJsonSchemaPropertyFromType(blueprints, attribute)
    if (attribute.dimensions === '*') {
      value = {
        type: 'array',
        items: {
          properties,
        },
      }
    } else {
      value = {
        type: 'object',
        properties,
      }
    }
  }
  ;(container as any)[attribute.name] = value
}

function getJsonSchemaPropertyFromType(
  blueprints: any[],
  attribute: BlueprintAttribute
) {
  const type = getBlueprintFromType(blueprints, attribute.type)
  const property = {}
  if (type) {
    if (type.attributes) {
      type.attributes.forEach((attribute: BlueprintAttribute) => {
        appendJsonSchemaProperty(attribute, property, blueprints)
      })
    } else {
      appendJsonSchemaProperty(type, property, blueprints)
    }
  } else {
    console.error('type is missing.', attribute.type)
  }
  return property
}
