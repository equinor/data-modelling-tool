import { GenerateUiRecipeTabs} from '../GenerateUiRecipeTabs'

describe('GenerateUiRecipeTabs', () => {
  it('add UI plugin tabs', () => {
    const generateUiTabs = new GenerateUiRecipeTabs(
      [
        {
          name: 'my tab',
          type: 'system/SIMOS/UiRecipe',
          plugin: 'EDIT_PLUGIN',
          attributes: [],
        },
        {
          name: 'YAML',
          type: 'system/SIMOS/UiRecipe',
          plugin: 'yaml-view'
        },
      ]
    )
    const tabs = generateUiTabs.uiRecipeTabs
    expect(tabs).toMatchObject([
      { name: 'my tab', plugin: 'EDIT_PLUGIN', attributes: [] },
      { name: 'YAML', plugin: 'yaml-view', attributes: [] },
    ])
  })

  it('should add a tab from a ui plugin', () => {
    const input = [
      {
        name: 'my tab',
        type: 'system/SIMOS/UiRecipe',
        plugin: 'INDEX',
        attributes: [],
      },
    ]
    const generateUiTabs = new GenerateUiRecipeTabs(input)
    const tabs = generateUiTabs.uiRecipeTabs
    expect(tabs).toHaveLength(1)
  })

})
