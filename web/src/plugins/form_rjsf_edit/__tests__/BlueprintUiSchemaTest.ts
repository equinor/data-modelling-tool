import { Blueprint as BlueprintType, UiRecipe } from '../../types'
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
    const blueprint: BlueprintType = {
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
        blueprint,
        blueprintProvider,
        uiRecipeTest,
        () => true
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
    const blueprint: BlueprintType = {
      name: '',
      description: '',
      type: '',
      attributes: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'wheel',
          type: 'ds/Wheel',
        },
        {
          name: 'wheels',
          type: 'ds/Wheel',
          dimensions: '*',
        },
      ],
      uiRecipes: [],
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
        blueprint,
        blueprintProvider,
        uiRecipeTest,
        () => true
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
