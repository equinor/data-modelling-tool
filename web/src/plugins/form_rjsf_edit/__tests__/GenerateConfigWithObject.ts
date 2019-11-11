import { generateTemplate } from '../GenerateTemplate'
import { generateUiSchema } from '../GenerateUiSchema'
import { Blueprint } from '../../types'
import basicObjectBlueprint from '../test_data/basic_object.json'
import nestedObjectBlueprint from '../test_data/nested_object.json'
import { createBlueprint } from '../test_data/utilTest'

// @ts-ignore
const basicObject: Blueprint = basicObjectBlueprint
const nestedObject: Blueprint = nestedObjectBlueprint

describe('Generate template', () => {
  let template = {}
  const attributes = [
    {
      name: 'someObject',
      type: '/BlueprintAttribute',
    },
  ]
  const blueprint = createBlueprint('Test', '/Blueprint', attributes)
  beforeEach(() => {
    template = generateTemplate(blueprint, [basicObject, nestedObject])
  })

  it('should have template', () => {
    const expectedTemplate = {
      type: 'object',
      properties: {
        someObject: {
          type: 'object',
          required: ['name'],
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
    }
    expect(template).toMatchObject(expectedTemplate)
  })

  it('should have uiSchema', () => {
    const blueprint = createBlueprint('Blueprint', '/Blueprint', attributes)
    const template = generateUiSchema(blueprint, [basicObject, nestedObject])
    const expectedUiSchema = {
      someObject: {
        name: {},
        description: {
          'ui:widget': 'textarea',
        },
        type: {
          'ui:widget': 'typeWidget',
        },
      },
    }
    expect(template).toMatchObject(expectedUiSchema)
  })
})
