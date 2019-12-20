import { BlueprintType, Entity } from '../../types'
import { BlueprintSchema } from '../BlueprintSchema'
import { BlueprintProvider } from '../../BlueprintProvider'
import { RegisteredPlugins } from '../../../pages/common/layout-components/DocumentComponent'
import { uiRecipeTest } from './BlueprintUiSchemaTest'

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
          type: 'string',
        },
        {
          name: 'pressure',
          type: 'number',
        },
        {
          name: 'diameter',
          type: 'number',
          dimensions: '*',
        },
      ],
      uiRecipes: [],
    }
    beforeEach(() => {
      const blueprintProvider = new BlueprintProvider([], [])
      schema = new BlueprintSchema(
        blueprintType,
        document,
        blueprintProvider,
        uiRecipeTest,
        () => true,
        undefined
      ).getSchema()
    })

    it('should have schema for basic blueprint', () => {
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

  describe('Nested form', () => {
    let schema: any = null
    const blueprintType: BlueprintType = {
      name: '',
      description: '',
      type: '',
      attributes: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'wheels',
          type: 'ds/Wheel',
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
            type: 'string',
          },
          {
            name: 'diameter',
            type: 'number',
          },
          {
            name: 'recursiveWheels',
            type: 'ds/Wheel',
            dimensions: '*',
          },
        ],
        uiRecipes: [
          {
            name: 'Edit',
            plugin: RegisteredPlugins.EDIT_PLUGIN,
            attributes: [
              {
                name: 'wheelName',
                required: true,
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

    beforeEach(() => {
      const blueprintProvider = new BlueprintProvider(blueprints, [])
      schema = new BlueprintSchema(
        blueprintType,
        document,
        blueprintProvider,
        uiRecipeTest,
        () => true,
        undefined
      ).getSchema()
    })

    it('should have schema for nested blueprint', () => {
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
