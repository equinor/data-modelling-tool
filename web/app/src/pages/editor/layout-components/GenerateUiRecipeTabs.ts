import { UiRecipe } from '../../../domain/types'

/**
 * Requirements:
 * 1. default tabs are listed first, in order.
 * 2. custom tabs are listed in order.
 * 3. default tabs can be replaced, without changing the order.
 */
export class GenerateUiRecipeTabs {
  public uiRecipeTabs: UiRecipe[] = []

  constructor(
    uiRecipes: UiRecipe[] | undefined,
  ) {

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
            this.uiRecipeTabs.push(uiRecipe)
          }
        }
      })
    }else{

    }
  }

  private isUiPlugin(plugin: string) {
    return !['INDEX', 'DEFAULT_CREATE'].includes(plugin)
  }

  private replaceUiRecipe(atIndex: number, uiRecipe: UiRecipe) {
    this.uiRecipeTabs.splice(atIndex, 1, uiRecipe)
  }

  getTabs() {
    return this.uiRecipeTabs
  }
}
