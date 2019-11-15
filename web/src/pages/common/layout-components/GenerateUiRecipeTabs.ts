import { RegisteredPlugins } from './DocumentComponent'
import {UiRecipe} from "../../../plugins/types";

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

  constructor(uiRecipes: UiRecipe[], defaultTabs = getDefaultTabs()) {
    this.uiRecipeTabs = defaultTabs

    if (uiRecipes) {
      uiRecipes.forEach((uiRecipe: UiRecipe) => {
        const existingIndex = this.uiRecipeTabs.findIndex(
          (tab: UiRecipe) => tab.name === uiRecipe.name
        )
        if (this.isUiPlugin(uiRecipe.plugin)) {
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
  return { name, plugin, attributes: [] }
}

export function getDefaultTabs(): UiRecipe[] {
  return [
    createUiRecipe('Raw', RegisteredPlugins.PREVIEW),
    createUiRecipe('Edit', RegisteredPlugins.EDIT_PLUGIN),
  ]
}
