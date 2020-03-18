import { BlueprintType, UiRecipe } from '../../../domain/types'
import { BlueprintUiSchema } from '../BlueprintUiSchema'
import { BlueprintProvider } from '../../BlueprintProvider'
import { RegisteredPlugins } from '../../../pages/common/layout-components/DocumentComponent'

export const uiRecipeTest: UiRecipe = {
  name: 'Edit',
  type: 'system/Simos/UiRecipe',
  plugin: RegisteredPlugins.EDIT_PLUGIN,
  attributes: [],
}

describe('BlueprintUiSchema', () => {
  describe('Basic ui schema', () => {
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
      uiRecipes: [
        {
          name: 'Edit',
          description: 'override default ui recipe',
          plugin: 'EDIT_PLUGIN',
          attributes: [
            {
              name: 'name',
              widget: 'textarea',
            },
          ],
        },
      ],
    }
    beforeEach(() => {
      const blueprintProvider = new BlueprintProvider([], [])
      schema = new BlueprintUiSchema(
        blueprintType,
        blueprintProvider,
        uiRecipeTest
      ).getSchema()
    })

    it('should have ui schema for basic blueprint', () => {
      // console.log(JSON.stringify(schema, null, 2))
      expect(schema).toMatchObject({
        name: {
          'ui:widget': 'textarea',
        },
      })
    })
  })

  describe('Nested ui schema', () => {
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
          name: 'wheel',
          attributeType: 'ds/Wheel',
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
          description: '',
          plugin: 'EDIT_PLUGIN',
          attributes: [
            {
              name: 'wheel',
              contained: true,
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
        ],
        uiRecipes: [
          {
            name: 'Edit',
            description: '',
            plugin: 'EDIT_PLUGIN',
            attributes: [
              {
                name: 'wheelName',
                widget: 'textarea',
              },
            ],
          },
        ],
      },
    ]
    beforeEach(() => {
      const blueprintProvider = new BlueprintProvider(blueprints, [])
      schema = new BlueprintUiSchema(
        blueprintType,
        blueprintProvider,
        uiRecipeTest
      ).getSchema()
    })

    it('should have schema for nested blueprint', () => {
      // console.log(JSON.stringify(schema, null, 2))
      const expected = {
        wheel: {
          wheelName: {
            'ui:widget': 'textarea',
          },
        },
        wheels: {
          items: {
            wheelName: {
              'ui:widget': 'textarea',
            },
          },
        },
      }
      // paste this into https://rjsf-team.github.io/react-jsonschema-form/
      // console.log(JSON.stringify(expected, null, 2))
      expect(schema).toMatchObject(expected)
    })
  })
})
