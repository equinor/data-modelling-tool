import { Blueprint, BlueprintAttribute } from '../types'
import { JsonSchemaArray, JsonSchemaObject } from './CreateConfig'
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

export function generateTemplateByProperty(
  blueprint: Blueprint,
  blueprints: Blueprint[],
  attributeName: string
): JsonSchemaObject | JsonSchemaArray {
  const property: BlueprintAttribute | undefined = blueprint.attributes.find(
    (attr: BlueprintAttribute) => attr.name === attributeName
  )

  const properties = {}
  if (property) {
    appendJsonSchemaProperty(property, properties, blueprints)
  } else {
    console.error(
      'failed to generate template from blueprint: ' + blueprint.name
    )
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
    console.error('type is missing.')
  }
  return property
}
