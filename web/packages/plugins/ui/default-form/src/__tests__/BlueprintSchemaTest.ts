import { BlueprintType, Entity } from '../domain/types'
import { BlueprintSchema } from '../BlueprintSchema'
import { uiRecipeTest } from './BlueprintUiSchemaTest'
import { act } from '@testing-library/react-hooks'

const document: Entity = {
  name: '',
  description: '',
  type: '',
}

describe('BlueprintSchema', () => {
  describe('Basic form', () => {
    let schema: any = null
    const blueprintType: BlueprintType = {
      name: '',
      description: '',
      type: '',
      attributes: [
        {
          name: 'name',
          attributeType: 'string',
          type: 'system/SIMOS/BlueprintAttribute',
        },
        {
          name: 'pressure',
          attributeType: 'number',
          type: 'system/SIMOS/BlueprintAttribute',
        },
        {
          name: 'diameter',
          attributeType: 'number',
          type: 'system/SIMOS/BlueprintAttribute',
          dimensions: '*',
        },
      ],
      uiRecipes: [],
    }

    beforeEach(async () => {
      await act(async () => {
        const schemaGenerator = new BlueprintSchema(
          blueprintType,
          uiRecipeTest,
          () => {},
          '',
          undefined
        )
        await schemaGenerator.execute(document, () => {})
        schema = schemaGenerator.getSchema()
      })
    })

    it('should have schema for basic blueprint', async () => {
      //console.log(JSON.stringify(schema, null, 2))
      const expected = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          pressure: {
            type: 'number',
          },
          diameter: {
            type: 'array',
            items: {
              type: 'number',
            },
          },
        },
      }
      expect(schema).toMatchObject(expected)
    })
  })

  describe.skip('Nested form', () => {
    let schema: any = null
    const blueprintType: BlueprintType = {
      name: '',
      description: '',
      type: '',
      attributes: [
        {
          name: 'name',
          attributeType: 'string',
          type: 'system/SIMOS/BlueprintAttribute',
        },
        {
          name: 'wheels',
          attributeType: 'ds/Wheel',
          type: 'system/SIMOS/BlueprintAttribute',
          dimensions: '*',
        },
      ],
      uiRecipes: [
        {
          name: 'Edit',
          plugin: 'EDIT_PLUGIN',
          attributes: [
            {
              name: 'name',
              required: true,
            },
            {
              name: 'wheels',
              contained: true,
            },
          ],
        },
      ],
    }
    const blueprints: BlueprintType[] = [
      {
        name: 'Wheel',
        description: '',
        type: 'system/SIMOS/blueprint',
        attributes: [
          {
            name: 'wheelName',
            attributeType: 'string',
            type: 'system/SIMOS/BlueprintAttribute',
          },
          {
            name: 'diameter',
            attributeType: 'number',
            type: 'system/SIMOS/BlueprintAttribute',
          },
          {
            name: 'recursiveWheels',
            attributeType: 'ds/Wheel',
            type: 'system/SIMOS/BlueprintAttribute',
            dimensions: '*',
          },
        ],
        uiRecipes: [
          {
            name: 'Edit',
            plugin: 'EDIT_PLUGIN',
            attributes: [
              {
                name: 'wheelName',
                required: true,
              },
              {
                name: 'recursiveWheels',
                contained: true,
              },
            ],
          },
        ],
      },
    ]
    const document: Entity = {
      type: '',
      name: '',
      description: '',
      wheels: [],
    }

    beforeEach(async () => {
      await act(async () => {
        const schemaGenerator = new BlueprintSchema(
          blueprintType,
          uiRecipeTest,
          () => {},
          ''
        )
        await schemaGenerator.execute(document, () => {})
        schema = schemaGenerator.getSchema()
      })
    })

    it('should have schema for nested blueprint', async () => {
      // console.log(JSON.stringify(schema, null, 2))
      const expected = {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
          },
          wheels: {
            type: 'array',
            items: {
              properties: {
                diameter: {
                  type: 'number',
                },
                recursiveWheels: {
                  items: {
                    properties: {},
                    required: ['wheelName'],
                  },
                  type: 'array',
                },
                wheelName: {
                  type: 'string',
                },
              },
              required: ['wheelName'],
            },
          },
        },
      }
      expect(schema).toEqual(expected)
    })
  })
})
