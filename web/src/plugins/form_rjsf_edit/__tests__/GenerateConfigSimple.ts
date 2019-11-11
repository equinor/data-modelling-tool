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
      type: 'string',
      name: 'description',
    },
    {
      type: 'string',
      name: 'name',
    },
    {
      type: 'string',
      name: 'type',
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
        name: {
          type: 'string',
          name: 'name',
        },
        type: {
          type: 'string',
          name: 'type',
        },
        description: {
          type: 'string',
          name: 'description',
        },
      },
    }
    expect(template).toMatchObject(expectedTemplate)
  })

  it('should have uiSchema', () => {
    const blueprint = createBlueprint(
      'Blueprint',
      'system/SIMOS/Blueprint',
      attributes
    )
    const template = generateUiSchema(blueprint, [basicObject, nestedObject])
    const expectedUiSchema = {
      description: { 'ui:widget': 'textarea' },
      name: { 'ui:readonly': true },
      type: { 'ui:readonly': true },
    }
    expect(template).toMatchObject(expectedUiSchema)
  })
})
