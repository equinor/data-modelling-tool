import { UiRecipe } from '../../../domain/types'

/**
 * Requirements:
 * 1. default tabs are listed first, in order.
 * 2. custom tabs are listed in order.
 * 3. default tabs can be replaced, without changing the order.
 */
export class GenerateUiRecipeTabs {
  private uiRecipeTabs: UiRecipe[] = []

  constructor(
    uiRecipes: UiRecipe[] | undefined,
    defaultTabs: UiRecipe[] | undefined
  ) {
    this.uiRecipeTabs = defaultTabs ? defaultTabs : getDefaultTabs([])

    if (uiRecipes) {
      uiRecipes.forEach((uiRecipe: UiRecipe) => {
        const existingIndex = this.uiRecipeTabs.findIndex(
          (tab: UiRecipe) =>
            tab.name === uiRecipe.name && tab.plugin === uiRecipe.plugin
        )
        if (this.isUiPlugin(uiRecipe.name) && !uiRecipe.hideTab) {
          if (existingIndex > -1) {
            this.replaceUiRecipe(existingIndex, uiRecipe)
          } else {
            this.addUiRecipe(uiRecipe)
          }
        }
      })
    }
  }

  private isUiPlugin(plugin: string) {
    return !['INDEX', 'DEFAULT_CREATE'].includes(plugin)
  }

  private replaceUiRecipe(atIndex: number, uiRecipe: UiRecipe) {
    this.uiRecipeTabs.splice(atIndex, 1, uiRecipe)
  }

  private addUiRecipe(uiRecipe: UiRecipe) {
    this.uiRecipeTabs.push(uiRecipe)
  }

  getTabs() {
    return this.uiRecipeTabs
  }
}

function createUiRecipe(name: string, plugin: string): UiRecipe {
  return { name, plugin, attributes: [], type: 'system/SIMOS/UiRecipe' }
}

export function getDefaultTabs(uiRecipes: UiRecipe[] | undefined): UiRecipe[] {
  const defaultTabs: UiRecipe[] = []
  addDefaultTab(defaultTabs, uiRecipes, 'yaml-view', 'Yaml')
  addDefaultTab(defaultTabs, uiRecipes, 'default-preview', 'Raw')
  // @ts-ignore
  addDefaultTab(defaultTabs, uiRecipes, 'default-form', 'Edit')
  return defaultTabs
}

export function getDefaultViewTabs(
  uiRecipes: UiRecipe[] | undefined
): UiRecipe[] {
  const defaultTabs: UiRecipe[] = []
  addDefaultTab(defaultTabs, uiRecipes, 'yaml-view', 'Yaml')
  addDefaultTab(defaultTabs, uiRecipes, 'default-preview', 'Raw')
  return defaultTabs
}

function addDefaultTab(
  defaultTabs: UiRecipe[],
  recipes: UiRecipe[] | undefined,
  plugin: string,
  name: string
): void {
  const recipe: UiRecipe | undefined =
    recipes && recipes.find((recipe) => recipe.name === name)
  if (recipe) {
    if (!recipe.hideTab) {
      defaultTabs.push(createUiRecipe(name, plugin))
    }
  } else {
    defaultTabs.push(createUiRecipe(name, plugin))
  }
}
