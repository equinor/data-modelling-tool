import { generateTemplate } from '../GenerateTemplate'
import { Blueprint } from '../../types'
import basicObjectBlueprint from '../test_data/basic_object.json'
import nestedObjectBlueprint from '../test_data/nested_object.json'
import { generateUiSchema } from '../GenerateUiSchema'
import { createBlueprint } from '../test_data/utilTest'

// @ts-ignore
const basicObject: Blueprint = basicObjectBlueprint
const nestedObject: Blueprint = nestedObjectBlueprint

describe('Generate template', () => {
  let template = {}
  const attributes = [
    {
      name: 'objectArray',
      dimensions: '*',
      type: 'system/SIMOS/BlueprintAttribute',
    },
  ]

  beforeEach(() => {
    const blueprint = createBlueprint('Test', '/Blueprint', attributes)
    template = generateTemplate(blueprint, [basicObject, nestedObject])
  })

  it('should have template', () => {
    const expectedTemplate = {
      type: 'object',
      properties: {
        objectArray: {
          type: 'array',
          items: {
            properties: {
              name: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
            },
          },
        },
      },
    }
    expect(template).toMatchObject(expectedTemplate)
  })

  it('should have uiSchema', () => {
    const blueprint = createBlueprint('Any', '/Blueprint', attributes)
    const template = generateUiSchema(blueprint, [basicObject, nestedObject])
    const expectedUiSchema = {
      objectArray: {
        items: {
          name: {},
          description: {
            'ui:widget': 'textarea',
          },
        },
      },
    }
    expect(template).toMatchObject(expectedUiSchema)
  })
})
