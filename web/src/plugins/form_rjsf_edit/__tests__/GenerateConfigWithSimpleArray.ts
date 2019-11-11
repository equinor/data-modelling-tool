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
      name: 'simpleArray',
      type: 'number',
      dimensions: '*',
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
        simpleArray: {
          type: 'array',
          items: {
            type: 'number',
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
      simpleArray: {},
    }
    expect(template).toMatchObject(expectedUiSchema)
  })
})
