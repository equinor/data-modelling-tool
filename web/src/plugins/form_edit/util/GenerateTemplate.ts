import { Blueprint, BlueprintAttribute } from '../../types'
import { JsonSchemaArray, JsonSchemaObject } from './CreateConfig'
import {
  getBlueprintFromType,
  isPrimitive,
  parseAttributeDefault,
} from '../../pluginUtils'

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

export function generateTemplateByProperty(
  parent: Blueprint,
  children: Blueprint[],
  attributeName: string
): JsonSchemaObject | JsonSchemaArray {
  const property: BlueprintAttribute | undefined = parent.attributes.find(
    (attr: BlueprintAttribute) => attr.name === attributeName
  )

  const properties = {}
  if (property) {
    appendJsonSchemaProperty(property, properties, children)
  } else {
    console.error('failed to generate template from blueprint: ' + parent.name)
  }
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
  types: Blueprint[]
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
    const properties = getJsonSchemaPropertyFromType(types, attribute)
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
  types: any[],
  attribute: BlueprintAttribute
) {
  const type = getBlueprintFromType(types, attribute.type)
  const property = {}
  if (type) {
    if (type.attributes) {
      type.attributes.forEach((attribute: BlueprintAttribute) => {
        appendJsonSchemaProperty(attribute, property, types)
      })
    } else {
      // That is, `type` is an instance of a blueprint
      appendJsonSchemaProperty(type, property, types)
    }
  } else {
    console.error('type is missing.')
  }
  return property
}
