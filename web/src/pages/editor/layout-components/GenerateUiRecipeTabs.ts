import { RegisteredPlugins } from './DocumentComponent'
import { UiRecipe } from '../../../domain/types'

/**
 * Requirements:
 * 1. default tabs are listed first, in order.
 * 2. custom tabs are listed in order.
 * 3. default tabs can be replaced, without changing the order.
 */
export class GenerateUiRecipeTabs {
  // turn enum into an object.
  private registeredPluginsObject: Object = JSON.parse(
    JSON.stringify(RegisteredPlugins)
  )

  private uiRecipeTabs: UiRecipe[] = []

  constructor(
    uiRecipes: UiRecipe[] | undefined,
    defaultTabs: UiRecipe[] | undefined
  ) {
    this.uiRecipeTabs = defaultTabs ? defaultTabs : getDefaultTabs([])

    if (uiRecipes) {
      uiRecipes.forEach((uiRecipe: UiRecipe) => {
        const existingIndex = this.uiRecipeTabs.findIndex(
          (tab: UiRecipe) => tab.name === uiRecipe.name
        )
        if (this.isUiPlugin(uiRecipe.plugin) && !uiRecipe.hideTab) {
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
    return (this.registeredPluginsObject as any)[plugin]
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
  addDefaultTab(defaultTabs, uiRecipes, RegisteredPlugins.PREVIEW, 'Raw')
  addDefaultTab(defaultTabs, uiRecipes, RegisteredPlugins.EDIT_PLUGIN, 'Edit')
  return defaultTabs
}

function addDefaultTab(
  defaultTabs: UiRecipe[],
  recipes: UiRecipe[] | undefined,
  plugin: RegisteredPlugins,
  name: string
): void {
  const recipe: UiRecipe | undefined =
    recipes && recipes.find(recipe => recipe.name === name)
  if (recipe) {
    if (!recipe.hideTab) {
      defaultTabs.push(createUiRecipe(name, plugin))
    }
  } else {
    defaultTabs.push(createUiRecipe(name, plugin))
  }
}
