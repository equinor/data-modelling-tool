import { UiRecipe } from '../../../domain/types'

export class GenerateUiRecipeTabs {
  public uiRecipeTabs: UiRecipe[] = []

  constructor(uiRecipes: UiRecipe[] | undefined) {
    // Adds a tab for every uiRecipe that should be shown
    if (uiRecipes?.length) {
      uiRecipes.forEach((uiRecipe: UiRecipe) => {
        const existingIndex = this.uiRecipeTabs.findIndex(
          (tab: UiRecipe) =>
            tab.name === uiRecipe.name && tab.plugin === uiRecipe.plugin
        )
        if (this.isUiPlugin(uiRecipe.name) && !uiRecipe.hideTab) {
          if (existingIndex > -1) {
            this.replaceUiRecipe(existingIndex, uiRecipe)
          } else {
            this.uiRecipeTabs.push(uiRecipe)
          }
        }
      })
      //  If no uiRecipe set in blueprint of the entity. Just show a plain JSON view and the default edit plugin.
    } else {
      this.uiRecipeTabs.push({
        name: 'View',
        plugin: 'default-preview',
        attributes: [],
        type: 'system/SIMOS/UiRecipe',
        options: [],
      })
      this.uiRecipeTabs.push({
        name: 'Edit',
        plugin: 'default-form',
        attributes: [],
        type: 'system/SIMOS/UiRecipe',
      })
    }
  }

  private isUiPlugin(plugin: string) {
    return !['INDEX', 'DEFAULT_CREATE'].includes(plugin)
  }

  private replaceUiRecipe(atIndex: number, uiRecipe: UiRecipe) {
    this.uiRecipeTabs.splice(atIndex, 1, uiRecipe)
  }
}
