import { GenerateUiRecipeTabs, getDefaultTabs } from '../GenerateUiRecipeTabs'

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
      { name: 'Raw', plugin: 'default-preview', attributes: [] },
      { name: 'Edit', plugin: 'default-form', attributes: [] },
      { name: 'my tab', plugin: 'EDIT_PLUGIN', attributes: [] },
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
    const generateUiTabs = new GenerateUiRecipeTabs(
      input,
      getDefaultTabs([])
    )
    const tabs = generateUiTabs.getTabs()
    expect(tabs).toHaveLength(3)
  })

  it('should not add a default tab if exists', () => {
    const recipes = [
      {
        name: 'Raw',
        type: 'system/SIMOS/UiRecipe',
        plugin: 'default-preview',
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
