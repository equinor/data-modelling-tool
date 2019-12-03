import { GenerateUiRecipeTabs, getDefaultTabs } from '../GenerateUiRecipeTabs'
import { RegisteredPlugins } from '../DocumentComponent'

describe('GenerateUiRecipeTabs', () => {
  it('should add defaults', () => {
    const tabsLength = getDefaultTabs([]).length
    const generateUiTabs = new GenerateUiRecipeTabs([], getDefaultTabs([]))
    const tabs = generateUiTabs.getTabs()
    expect(tabs).toHaveLength(tabsLength)
    expect(tabs).toMatchObject(getDefaultTabs([]))
  })

  it('should add a tab from a ui plugin', () => {
    const generateUiTabs = new GenerateUiRecipeTabs(
      [
        {
          name: 'my tab',
          type: 'system/SIMOS/UiRecipe',
          plugin: 'EDIT_PLUGIN',
          attributes: [],
        },
      ],
      getDefaultTabs([])
    )
    const tabs = generateUiTabs.getTabs()
    expect(tabs).toHaveLength(getDefaultTabs([]).length + 1)
    expect(tabs).toMatchObject([
      { name: 'Raw', plugin: 'PREVIEW', attributes: [] },
      { name: 'Edit', plugin: 'EDIT_PLUGIN', attributes: [] },
      { name: 'my tab', plugin: 'EDIT_PLUGIN', attributes: [] },
    ])
  })

  it('should not add a tab from a ui plugin', () => {
    const generateUiTabs = new GenerateUiRecipeTabs(
      [
        {
          name: 'my tab',
          type: 'system/SIMOS/UiRecipe',
          plugin: 'INDEX',
          attributes: [],
        },
      ],
      getDefaultTabs([])
    )
    const tabs = generateUiTabs.getTabs()
    expect(tabs).toHaveLength(2)
    expect(tabs).toMatchObject(getDefaultTabs([]))
  })

  it('should not add a default tab', () => {
    const recipes = [
      {
        name: 'Raw',
        type: 'system/SIMOS/UiRecipe',
        plugin: RegisteredPlugins.PREVIEW,
        hideTab: true,
        attributes: [],
      },
    ]
    const defaultTabs = getDefaultTabs(recipes)
    expect(defaultTabs).toHaveLength(1)

    const generateUiTabs = new GenerateUiRecipeTabs(
      recipes,
      getDefaultTabs(recipes)
    )
    expect(generateUiTabs.getTabs()).toHaveLength(1)
  })
})
